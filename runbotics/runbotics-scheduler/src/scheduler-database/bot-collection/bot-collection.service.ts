import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, In, Repository, And, Equal, FindOperator } from 'typeorm';
import { IBotCollection, FeatureKey } from 'runbotics-common';
import { BotCollection } from './bot-collection.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { CreateBotCollectionDto } from '#/scheduler-database/bot-collection/dto/create-bot-collection.dto';
import { UpdateBotCollectionDto } from '#/scheduler-database/bot-collection/dto/update-bot-collection.dto';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { DefaultCollections } from 'runbotics-common';
import { UserService } from '../user/user.service';
import { hasFeatureKey, isTenantAdmin } from '#/utils/authority.utils';

const RELATIONS: FindOptionsRelations<BotCollection> = {
    createdByUser: true,
    users: true,
};

@Injectable()
export class BotCollectionService {
    constructor(
        @InjectRepository(BotCollection)
        private botCollectionRepository: Repository<BotCollection>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
        private readonly userService: UserService
    ) {}

    getById(id: string): Promise<BotCollection> {
        return this.botCollectionRepository.findOne({ where: { id }, relations: RELATIONS });
    }

    async save(botCollection: IBotCollection) {
        await this.botCollectionRepository.save(botCollection);
        return botCollection;
    }

    async saveDto(user: User, collectionDto: CreateBotCollectionDto) {
        const isUserTenantAdmin = isTenantAdmin(user);

        const collection = new BotCollection();
        collection.name = collectionDto.name;
        collection.description = collectionDto.description;
        collection.publicBotsIncluded = collectionDto.publicBotsIncluded;
        collection.createdByUser = user;
        collection.tenantId = user.tenantId;

        await this.isCollectionNameTakenInTenant(collection.name, collection.tenantId);

        if (!isUserTenantAdmin && this.isDefaultCollectionName(collection.name)) {
            throw new BadRequestException('Collection name restricted');
        }

        if (collectionDto.users) {
            const userIds = collectionDto.users.map(user => user.id);
            const users = await this.userRepository.findBy({ id: In(userIds), tenantId: user.tenantId });
            if (users.length !== userIds.length) {
                throw new BadRequestException('Invalid users provided for bot collection');
            }
            collection.users = users;
        }

        const newCollection = await this.botCollectionRepository.save(collection);

        return this.mapCollectionUserToBasic(newCollection);
    }

    async updateDto(id: string, user: User, collectionDto: UpdateBotCollectionDto) {
        const collection = await this.botCollectionRepository.findOneByOrFail({ tenantId: user.tenantId, id }).catch(() => {
            throw new NotFoundException();
        });

        if (collection.name !== collectionDto.name) {
            await this.isCollectionNameTakenInTenant(collectionDto.name, collection.tenantId);
        }

        collection.name = collectionDto.name;
        collection.description = collectionDto.description;
        collection.publicBotsIncluded = collectionDto.publicBotsIncluded;
        collection.createdByUser = user;

        if (collectionDto.users) {
            const userIds = collectionDto.users.map(user => user.id);
            const users = await this.userRepository.findBy({ id: In(userIds), tenantId: user.tenantId });
            if (users.length !== userIds.length) {
                throw new BadRequestException('Invalid users provided for bot collection');
            }
            collection.users = users;
        }

        const updatedCollection = await this.botCollectionRepository.save(collection);

        return this.mapCollectionUserToBasic(updatedCollection);
    }

    async findAll(user: User, specs: Specs<BotCollection>) {
        const options: FindManyOptions<BotCollection> = {};
        options.where = [
            {
                ...specs.where,
                tenantId: user.tenantId
            }
        ];

        options.order = specs.order;
        options.relations = RELATIONS;

        const foundCollections = await this.botCollectionRepository.find(options);

        return foundCollections.map(collection => this.mapCollectionUserToBasic(collection));
    }

    async findAllPage(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options: FindManyOptions<BotCollection> = {};
        options.where = [
            {
                ...specs.where,
                tenantId: user.tenantId
            }
        ];

        options.order = specs.order;

        options.skip = paging.skip;
        options.take = paging.take;
        options.relations = RELATIONS;

        return getPage(this.botCollectionRepository, options);
    }

    findByIdForAdmin(id: string, user: User) {
        return this.botCollectionRepository
            .findOneOrFail({
                where: {
                    tenantId: user.tenantId,
                    id
                },
                relations: RELATIONS
            })
            .catch(() => {
                throw new NotFoundException('Collection with provided id does not exist');
            });
    }

    async findByIdForUser(id: string, user: User) {
        const foundCollection = await this.findByIdForAdmin(id, user);

        if (this.isDefaultCollectionName(foundCollection.name)) return foundCollection;

        if (foundCollection.createdByUser.id === user.id || foundCollection.users.find(sharedWithUser => sharedWithUser.id === user.id)) {
            return foundCollection;
        }

        throw new ForbiddenException('You don\'t have access to this collection');
    }

    findById(id: string, user: User) {
        if (hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            return this.findByIdForAdmin(id, user);
        }
        return this.findByIdForUser(id, user);
    }

    async delete(id: string, user: User) {
        await this.findById(id, user);

        await this.checkIfCollectionIsUsedInProcess(id);

        return this.botCollectionRepository.delete({ id, tenantId: user.tenantId });
    }

    async findForUser(user: User, specs: Specs<BotCollection>) {
        const options = this.getFindOptions(user, specs);

        const collections = await this.botCollectionRepository.find(options);
        return hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)
        ? collections
        : collections.map(collection => this.mapCollectionUserToBasic(collection));
    }

    async findIdsForTenantAdmin(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options: FindManyOptions<BotCollection> = {
            ...paging,
            where: [
                {
                    tenantId: user.tenantId,
                    name: specs.where.name
                }
            ],
            relations: RELATIONS
        };

        const page = await getPage(this.botCollectionRepository, options);

        return page.content.map(collection => collection.id);
    }

    async findIds(user: User, specs: Specs<BotCollection>, paging: Paging) {
        if (hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            return this.findIdsForTenantAdmin(user, specs, paging);
        }

        return this.findIdsForUser(user, specs, paging);
    }

    async findIdsForUser(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options = this.getFindOptions(user, specs, paging);
        options.select = { id: true };

        const page = await getPage(this.botCollectionRepository, options);

        return page.content.map(collection => collection.id);
    }

    async findPageForUser(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const ids = await this.findIds(user, specs, paging);
        const options: FindManyOptions<BotCollection> = {
            where: { id: In(ids) },
            relations: RELATIONS
        };

        const page = await getPage(this.botCollectionRepository, options);

        return {
            ...page,
            content: page.content.map(collection => this.mapCollectionUserToBasic(collection))
        };
    }

    async isDefaultCollection(id: string) {
        const collection = await this.botCollectionRepository.findOneBy({ id });

        if (!collection) return false;

        return this.isDefaultCollectionName(collection.name);
    }

    async isCollectionNameTakenInTenant(name: string, tenantId: string) {
        const collections = await this.botCollectionRepository.findBy({ name, tenantId });

        if (collections.length) {
            throw new BadRequestException('Collection with this name already exists in tenant');
        }
    }

    private isDefaultCollectionName(name: string) {
        return Object.values(DefaultCollections).includes(name as DefaultCollections);
    }

    private mapCollectionUserToBasic(collection: BotCollection) {
        return {
            ...collection,
            createdByUser: this.userService.mapToBasicUserDto(collection.createdByUser),
            users: collection.users.map(user => this.userService.mapToBasicUserDto(user))
        };
    }

    private buildWhereConditions(user: User, specs: Specs<BotCollection>) {
        const nameCondition = specs.where.name;

        return [
            {
                tenantId: user.tenantId,
                users: { id: user.id },
                name: nameCondition
            },
            {
                tenantId: user.tenantId,
                createdByUser: { id: user.id },
                name: nameCondition
            },
            {
                tenantId: user.tenantId,
                name: nameCondition ? And(Equal(DefaultCollections.GUEST), nameCondition as FindOperator<string>) : DefaultCollections.GUEST
            },
            {
                tenantId: user.tenantId,
                name: nameCondition
                    ? And(Equal(DefaultCollections.PUBLIC), nameCondition as FindOperator<string>)
                    : DefaultCollections.PUBLIC
            }
        ];
    }

    private getFindOptions(user: User, specs: Specs<BotCollection>, paging?: Paging): FindManyOptions<BotCollection> {
        const baseOptions: FindManyOptions<BotCollection> = {
            relations: RELATIONS
        };

        if (hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            return {
                ...baseOptions,
                where: [{ tenantId: user.tenantId, name: specs.where.name }]
            };
        }

        return {
            ...baseOptions,
            ...(paging || {}),
            where: this.buildWhereConditions(user, specs)
        };
    }

    private async checkIfCollectionIsUsedInProcess(collectionId: string) {
        const processesUsingCollection = await this.processRepository.countBy({ botCollectionId: collectionId });

        if (processesUsingCollection) {
            throw new BadRequestException('Cannot delete collection which used in at least one process');
        }
    }
}
