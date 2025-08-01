import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Equal, FindOptionsRelations, In, IsNull, Repository } from 'typeorm';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollection } from './process-collection.entity';
import { CreateProcessCollectionDto } from './dto/create-process-collection.dto';
import { ProcessCollectionDto } from './dto/process-collection.dto';
import { FeatureKey } from 'runbotics-common';
import { UpdateProcessCollectionDto } from './dto/update-process-collection.dto';
import { ProcessCollectionWithUsersDto } from './dto/process-collection-with-users.dto';
import { hasFeatureKey } from '#/utils/authority.utils';

const RELATIONS: FindOptionsRelations<ProcessCollection> = {
    createdBy: true,
    users: true
};

@Injectable()
export class ProcessCollectionService {
    constructor(
        @InjectRepository(ProcessCollection)
        private processCollectionRepository: Repository<ProcessCollection>,
    ) {}

    withEntityManager(em: EntityManager): ProcessCollectionService {
        return new ProcessCollectionService(
            em.getRepository(ProcessCollection),
        );
    }

    async getProcessCollectionById(id: string, user: User): Promise<ProcessCollection> {
        const collection = await this.processCollectionRepository.findOneOrFail({ where: { id }, relations: RELATIONS })
            .catch((error) => {
                throw new NotFoundException(`Cannot get: Process collection with id ${id} could not be found`, error);
            }
        );
        const hasAccess = this.hasAccess(user, collection.id);

        if (hasAccess)
            return collection;
        else
            throw new ForbiddenException('Forbidden: No access to this process collection');
    }

    async getInside(user: User, id: string): Promise<ProcessCollection> {
        const processCollection = await this.processCollectionRepository.findOneOrFail({ where: { id }, relations: RELATIONS })
            .catch((error) => {
                throw new NotFoundException(`Cannot get: Process collection with id ${id} could not be found`, error);
            });

        return processCollection;
    }

    async checkCanCreate(user: User, name: string, parent: ProcessCollection, id?: string): Promise<boolean> {
        const siblingsWithTheSameName = parent?.id
            ? await this.findSiblingWithTheSameName(name, parent.id)
            : await this.findAllSameNameRootCollections(name);

        const isNameAvailable = siblingsWithTheSameName.length === 0 || siblingsWithTheSameName[0].id === id;
        return isNameAvailable;
    }

    async checkHasAccessToCollection(user: User, processCollectionId: string): Promise<boolean> {
        if (!processCollectionId) {
            return true;
        }

        const parentId = (await this.processCollectionRepository.findOne({ where: { id: processCollectionId } })).parentId;
        const hasAccessToParent = await this.checkHasAccessToCollection(user, parentId);
        const hasAccess = await this.processCollectionRepository.query(`
                SELECT count(*) FROM process_collection pc
                WHERE
                    (id = $1 AND
                    (EXISTS (SELECT 1 FROM process_collection_user pcu WHERE pcu.user_id = $2 AND pcu.collection_id = $1)
                    OR pc.is_public = true
                    OR pc.created_by = $2))
            `, [processCollectionId, user.id])
            .catch(() => false)
            .then((res) => {
                return (res[0].count != 0);
            });
        

        return (hasAccessToParent && hasAccess);
    }

    async hasAccess(user: User, collectionId?: string): Promise<boolean> {
        const hasAllAccess = hasFeatureKey(
            user,
            FeatureKey.PROCESS_COLLECTION_ALL_ACCESS
        );

        if (hasAllAccess) return true;

        if (!collectionId) {
            return true;
        }

        return (
            (await this.checkHasAccessToCollection(user, collectionId)) &&
            (await this.processCollectionRepository
                .findOneOrFail({
                    relations: {
                        createdBy: true,
                    },
                    where: [
                        {
                            users: { id: user.id },
                            id: collectionId,
                        },
                        {
                            createdBy: Equal(user.id),
                        },
                    ],
                })
                .catch(() => false)
                .then((res) => {
                    return !!res;
                }))
        );
    }

   async countCollectionsById(collectionId: string, tenantId: string): Promise<number> {
        return this.processCollectionRepository.count({
            where: {
                id: collectionId,
                tenantId: tenantId,
            },
        });
   }

   async countAvailableCollectionsById(collectionId: string, tenantId: string, userId: number): Promise<number> { // TODO: change to return boolean during process-collection refactor
        return this.processCollectionRepository.createQueryBuilder('pc')
            .leftJoin('pc.users', 'u')
            .where('pc.id = :collectionId', { collectionId })
            .andWhere('pc.tenant_id = :tenantId', { tenantId })
            .andWhere('pc.is_public = true OR pc.created_by = :userId OR u.id = :userId', { userId })
            .select('COUNT(DISTINCT pc.id)', 'count')
            .getCount();
   }

    async countAvailableCollectionsByIds(collectionIds: string[], tenantId: string, userId: number): Promise<number> {
        return this.processCollectionRepository.find({
            where: [
                {
                    isPublic: true,
                    id: In(collectionIds),
                    tenantId,
                },
                {
                    createdBy: { id: userId },
                    id: In(collectionIds),
                    tenantId,
                },
                {
                    users: { id: userId },
                    id: In(collectionIds),
                    tenantId,
                },
            ],
        })
        .then(collections => new Set(collections.map(collection => collection.id)).size);
    }

    async findAvailableChildrenCollections(parentId: string, tenantId: string, userId: number): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({
            relations: RELATIONS,
            where: [
                {
                    isPublic: true,
                    parentId,
                    tenantId,
                },
                {
                    createdBy: { id: userId },
                    parentId,
                    tenantId,
                },
                {
                    users: { id: userId },
                    parentId,
                    tenantId,
                },
            ],
        });
    }

    async findAvailableRootCollections(tenantId: string, userId: number): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({
            relations: RELATIONS,
            where: [
                {
                    isPublic: true,
                    parentId: IsNull(),
                    tenantId,
                },
                {
                    createdBy: { id: userId },
                    parentId: IsNull(),
                    tenantId,
                },
                {
                    users: { id: userId },
                    parentId: IsNull(),
                    tenantId,
                },
            ],
        });
    }


    async findAllChildrenCollections(parentId: string, tenantId: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({
                relations: RELATIONS,
                where: {
                    parentId, tenantId
                },
            });
    }

    async findAllRootCollections(tenantId: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({ where: { parentId: IsNull(), tenantId }, relations: RELATIONS });
    }

    async findAllSameNameRootCollections(name: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({
            where: {
                parent: IsNull(),
                name,
            },
            relations: RELATIONS,
        });
    }

    async findSiblingWithTheSameName(name: string, parentId: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.createQueryBuilder('pc')
            .where('pc.parent_id = :parentId', { parentId })
            .andWhere('pc.name = :name', { name })
            .getMany();
    }

    async findAllAncestors(collectionId: string, tenantId: string): Promise<ProcessCollectionWithUsersDto[]> {
        const query =`
            WITH RECURSIVE bread_crumbs AS (
                SELECT pc.*, 1 AS lvl FROM process_collection pc
                WHERE pc.id = $1 AND pc.tenant_id = $2
                UNION
                SELECT pc.*, bc.lvl + 1 FROM bread_crumbs bc
                JOIN process_collection pc ON pc.id = bc.parent_id
            )
            SELECT
                bc.id,
                bc.name,
                bc.description,
                bc.created,
                bc.updated,
                bc.created_by,
                bc.is_public,
                bc.parent_id,
                bc.tenant_id,
                u.email
            FROM bread_crumbs bc
            LEFT JOIN jhi_user u ON bc.created_by = u.id
            ORDER BY bc.lvl DESC
        `;

        const ancestors = await this.processCollectionRepository.query(query, [collectionId, tenantId]);
        const ancestorsWithUsers = await Promise.all(ancestors.map(async (ancestor: ProcessCollection) => {
            const withUsers = await this.processCollectionRepository.findOneOrFail({ where: { id: ancestor.id }, relations: ['users'] });

            return { ...ancestor, users: withUsers.users };
        }));

        return ancestorsWithUsers;
    }

    mapProcessCollectionsWithUsersToDto(
        collections: ProcessCollectionWithUsersDto[]
    ): ProcessCollectionDto[] {
        if (!Array.isArray(collections) || collections.length === 0) {
            return [];
        }

        return (collections).map(
            (collection) => ({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                created: collection.created,
                updated: collection.updated,
                createdBy: {
                    id: Number(collection.created_by),
                    email: collection.email,
                },
                isPublic: collection.is_public,
                users:
                    collection.users?.map((user) => ({
                        id: user.id,
                    })) ?? [],
                parent: collection.parent_id
                    ? { id: collection.parent_id }
                    : null,
                tenantId: collection.tenant_id,
            })
        );
    }

    mapProcessCollectionsToDto(
        collections: ProcessCollection[]
    ): ProcessCollectionDto[] {
        if (!Array.isArray(collections) || collections.length === 0) {
            return [];
        }

        return (collections).map(
            (collection) => ({
                id: collection.id,
                name: collection.name,
                description: collection.description,
                created: collection.created,
                updated: collection.updated,
                createdBy: collection.createdBy
                    ? {
                        id: collection.createdBy.id,
                        email: collection.createdBy.email,
                    }
                    : null,
                isPublic: collection.isPublic,
                users:
                    collection.users?.map((user) => ({
                        id: user.id,
                    })) ?? [],
                parent: collection.parentId ? { id: collection.parentId } : null,
                tenantId: collection.tenantId,
            })
        );
    }
    
    async findAllUserAccessible(tenantId: string, userId: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.createQueryBuilder('pc')
            .leftJoin('pc.users', 'u')
            .where('pc.tenant_id = :tenantId', { tenantId })
            .andWhere('pc.is_public = true OR pc.created_by = :userId OR u.id = :userId', { userId })
            .distinct(true)
            .getMany();
    }

    async findUserAccessibleById(collectionId: string, userId: string, tenantId: string): Promise<ProcessCollection[]> { // TODO: change to return boolean during process-collection refactor
        return this.processCollectionRepository.createQueryBuilder('pc')
            .leftJoin('pc.users', 'u')
            .where('pc.id = :collectionId', { collectionId })
            .andWhere('pc.tenantId = :tenantId', { tenantId })
            .andWhere(
                new Brackets(qb => {
                    qb.where('pc.isPublic = true')
                      .orWhere('pc.createdBy = :userId', { userId })
                      .orWhere('u.id = :userId', { userId });
                })
            )
            .getMany();
    }

    async checkCollectionAvailability(collectionId: string, user: User) {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);
        const isCollectionNotFound = await this.countCollectionsById(collectionId, tenantId) === 0;

        if (isCollectionNotFound) {
            throw new NotFoundException('Cannot find process collection with id: ' + collectionId);
        }

        const isCollectionAvailable = await this.countAvailableCollectionsById(collectionId, tenantId, user.id) !== 0;
        if (!hasUserAllAccess && !isCollectionAvailable) {
            throw new ForbiddenException('No access to process collection');
        }
    }

    async getRootCollections(user: User): Promise<ProcessCollection[]> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);

        if (hasUserAllAccess) {
            const rootCollections = this.findAllRootCollections(tenantId);
            return rootCollections;
        }

        const rootAccessibleCollections = this.findAvailableRootCollections(tenantId, user.id);
        return rootAccessibleCollections;
    }

    async getChildrenCollectionsByRoot(user: User): Promise<ProcessCollectionDto[]> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);

       if (hasUserAllAccess) {
            const rootCollections = await this.findAllRootCollections(tenantId);
            return this.mapProcessCollectionsToDto(rootCollections);
        }

        const availableChildren = await this.findAvailableRootCollections(tenantId, user.id);
        return this.mapProcessCollectionsToDto(availableChildren);
    }

    async getChildrenCollectionsByParent(parentId: string, user: User): Promise<ProcessCollectionDto[]> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(
            user,
            FeatureKey.PROCESS_COLLECTION_ALL_ACCESS
        );

        if (hasUserAllAccess) {
            const childrenCollections = parentId
                ? await this.findAllChildrenCollections(parentId, tenantId)
                : await this.findAllRootCollections(tenantId);

            return this.mapProcessCollectionsToDto(childrenCollections);
        }

        const childrenAccessibleCollections = parentId
            ? await this.findAvailableChildrenCollections(
                  parentId,
                  tenantId,
                  user.id
              )
            : await this.findAvailableRootCollections(tenantId, user.id);

        return this.mapProcessCollectionsToDto(childrenAccessibleCollections);
    }

    async getCollectionAllAncestors(collectionId: string, user: User): Promise<ProcessCollectionDto[]> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);
        const ancestors = await this.findAllAncestors(collectionId, tenantId);
        const mappedAncestors = this.mapProcessCollectionsWithUsersToDto(ancestors);

        if (hasUserAllAccess) {
            return mappedAncestors;
        }

        const magicCount = await this.countAvailableCollectionsByIds(mappedAncestors.map(ancestor => ancestor.id), tenantId, user.id);
        const hasAccessToAllAncestors = magicCount === mappedAncestors.length;
        if (!hasAccessToAllAncestors) {
            throw new ForbiddenException('No access to process collection');
        }

        return mappedAncestors;
    }

    async delete(id: string, user: User): Promise<void> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);
        const hasCollectionAccess = hasUserAllAccess || (await this.findUserAccessibleById(id, String(user.id), tenantId)).length > 0;
        const isOwner = hasUserAllAccess || await this.processCollectionRepository.findOneOrFail({ where: { id, createdBy: { id: user.id }, } }).catch(() => false);

        const toDelete = await this.processCollectionRepository.findOneOrFail({ where: { id, tenantId } })
            .catch(() => {
                throw new NotFoundException('Cannot delete: Process collection not found');
            });

        if (!hasCollectionAccess) {
            throw new ForbiddenException('No access to process collection');
        }

        if (!isOwner) {
            throw new ForbiddenException('Only collection creator can delete the collection');
        }

        this.processCollectionRepository.remove(toDelete);
    }

    async update(user: User, updateDto: UpdateProcessCollectionDto, id: string): Promise<ProcessCollection> {
        const processCollection = new ProcessCollection();
        processCollection.id = id;
        processCollection.name = updateDto.name;
        processCollection.description = updateDto.description;
        processCollection.isPublic = updateDto.isPublic;
        processCollection.users = updateDto.users as User[];

        this.checkCollectionAvailability(id, user);

        const parent = updateDto.parentId
            ? await this.processCollectionRepository.findOneOrFail({ where: { id: updateDto.parentId }, relations: RELATIONS })
                .catch((error) => {
                    throw new NotFoundException(`Cannot update: Parent collection with id ${updateDto.parentId } could not be found`, error);
                })
            : null;
        processCollection.parent = parent;

        const canCreate = await this.checkCanCreate(user, updateDto.name, parent, id);
        if (!canCreate) {
           throw new BadRequestException('Cannot create: Process collection with this name and creator already exists in this location');
        }

        return this.processCollectionRepository.save(processCollection);
    }

    async create(user: User, createDto: CreateProcessCollectionDto): Promise<ProcessCollection> {
        const processCollection = new ProcessCollection();
        processCollection.name = createDto.name;
        processCollection.description = createDto.description ?? '';
        processCollection.createdBy = user;
        processCollection.isPublic = createDto.isPublic;
        processCollection.tenantId = user.tenantId;
        processCollection.users = createDto.users as User[];

        const parent = createDto.parentId
            ? await this.processCollectionRepository.findOneOrFail({ where: { id: createDto.parentId }, relations: RELATIONS })
                .catch((error) => {
                    throw new NotFoundException(`Cannot create: Parent collection with id ${createDto.parentId} could not be found`, error);
                })
            : null;
        processCollection.parent = parent;

        const hasParentAccess = createDto.parentId
            ? await this.checkHasAccessToCollection(user, createDto.parentId)
            : true;
        const canCreate = await this.checkCanCreate(user, createDto.name, parent);

        if (!hasParentAccess) {
            throw new BadRequestException('Cannot create: User does not have access to parent collection');
        } else if (!canCreate) {
           throw new BadRequestException('Cannot create: Process collection with this name and creator already exists in this location');
        }

        return this.processCollectionRepository.save(processCollection);
    }

    async getUserAccessible(user: User): Promise<ProcessCollection[]> {
        const tenantId = user.tenantId;
        const hasUserAllAccess = hasFeatureKey(user, FeatureKey.PROCESS_COLLECTION_ALL_ACCESS);

        if (hasUserAllAccess) {
            const allCollections = this.getAll(tenantId);
            return allCollections;
        }

        const userAccessibleCollections = this.findAllUserAccessible(tenantId, String(user.id));
        return userAccessibleCollections;
    }

    async getAll(tenantId: string): Promise<ProcessCollection[]> {
        return this.processCollectionRepository.find({ where: { tenantId }, relations: RELATIONS });
    }
}
