import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCredentialCollectionDto } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto } from './dto/update-credential-collection.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CredentialCollection } from './credential-collection.entity';
import { FindManyOptions, In, Repository } from 'typeorm';
import { CredentialCollectionUser } from '../credential-collection-user/credential-collection-user.entity';
import { UserService } from '#/scheduler-database/user/user.service';
import { AccessType, PrivilegeType, Tenant } from 'runbotics-common';
import { getPage, Page } from '#/utils/page/page';
import { Paging } from '#/utils/page/pageable.decorator';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { User } from '../user/user.entity';
import { isTenantAdmin } from '#/utils/authority.utils';

const RELATIONS = [
    'credentialCollectionUser',
    'credentialCollectionUser.user',
    'credentialCollectionUser.credentialCollection',
    'createdBy',
    'credentials'
];

@Injectable()
export class CredentialCollectionService {
    private readonly logger = new Logger(CredentialCollectionService.name);

    constructor(
        @InjectRepository(CredentialCollection)
        private readonly credentialCollectionRepository: Repository<CredentialCollection>,
        @InjectRepository(CredentialCollectionUser)
        private readonly credentialCollectionUserRepository: Repository<CredentialCollectionUser>,
        private readonly userService: UserService
    ) {}

    async create(createCredentialCollectionDto: CreateCredentialCollectionDto, user: User) {
        const tenantId = user.tenantId;
        const { name, description, accessType, color, sharedWith } = createCredentialCollectionDto;

        const { authorities, ...userDto } = user;
        const credentialCollection = await this.credentialCollectionRepository
            .save({
                name,
                description,
                accessType,
                color,
                createdBy: userDto,
                updatedBy: userDto,
                tenantId,
                credentialCollectionUser: []
            })
            .catch(async error => {
                await this.throwErrorIfNameTaken(userDto.tenantId, name, userDto.id);
                throw new BadRequestException(error.message);
            });

        if (accessType === AccessType.PRIVATE && !isTenantAdmin(user)) {
            const credentialCollectionCreator = this.credentialCollectionUserRepository.create({
                credentialCollectionId: credentialCollection.id,
                userId: userDto.id
            });

            credentialCollection.credentialCollectionUser.push(credentialCollectionCreator);
            return this.credentialCollectionRepository.save(credentialCollection);
        }

        if (sharedWith && sharedWith.length > 0) {
            const credentialCollectionUsersToSave = await this.getCollectionUserArrayWithPrivileges(
                sharedWith,
                credentialCollection,
                tenantId
            );

            credentialCollection.credentialCollectionUser = credentialCollectionUsersToSave;
        }

        return this.credentialCollectionRepository.save(credentialCollection);
    }

    findAllAccessible(user: User) {
        return this.credentialCollectionRepository
            .createQueryBuilder('credentialCollectionEntity')
            .leftJoinAndSelect('credentialCollectionEntity.credentials', 'allCredentials')
            .leftJoinAndSelect('credentialCollectionEntity.createdBy', 'createdBy')
            .innerJoinAndSelect(
                'credentialCollectionEntity.credentialCollectionUser',
                'credentialCollectionUser',
                `
                    credentialCollectionEntity.tenantId = :tenantId AND
                    credentialCollectionUser.user.id = :userId AND
                    credentialCollectionUser.privilegeType IN (:...privilegeTypes)
                    `,
                {
                    tenantId: user.tenantId,
                    userId: user.id,
                    privilegeTypes: [PrivilegeType.READ, PrivilegeType.WRITE]
                }
            )
            .innerJoinAndSelect('credentialCollectionEntity.credentialCollectionUser', 'allCredentialCollectionUser')
            .innerJoinAndSelect('allCredentialCollectionUser.user', 'user')
            .getMany();
    }

    async getAllAccessiblePages(user: User, specs: Specs<CredentialCollection>, paging: Paging): Promise<Page<CredentialCollection>> {
        const options: FindManyOptions<CredentialCollection> = {
            ...paging,
            ...specs,
            relationLoadStrategy: 'join',
        };

        options.where = {
            ...options.where,
            tenantId: user.tenantId,
        };

        options.relations = RELATIONS;
        const page = await getPage(this.credentialCollectionRepository, options);

        const userAccessedCollections = isTenantAdmin(user)
            ? page.content
            : page.content.filter((collection) =>
                  collection.credentialCollectionUser.some(
                      (ccu) => ccu.userId === user.id
                  )
              );

        return {
            ...page,
            content: userAccessedCollections,
        };
    }

    async findAllAccessibleWithUser(user: User) {
        const collections = await this.credentialCollectionRepository.find({
            where: {
                tenantId: user.tenantId,
                credentialCollectionUser: {
                    userId: user.id,
                    privilegeType: In([PrivilegeType.WRITE, PrivilegeType.READ])
                }
            },
            relations: [...RELATIONS, 'credentials.createdBy', 'credentials.collection']
        });

        return collections;
    }

    async findOneAccessibleById(id: string, user: User) {
        const collection = isTenantAdmin(user)
            ? await this.credentialCollectionRepository.findOne({
                  where: {
                      tenantId: user.tenantId,
                      id: id,
                  },
                  relations: ['createdBy'],
              })
            : await this.credentialCollectionRepository
                  .createQueryBuilder('credentialCollectionEntity')
                  .leftJoinAndSelect(
                      'credentialCollectionEntity.credentials',
                      'allCredentials'
                  )
                  .leftJoinAndSelect(
                      'credentialCollectionEntity.createdBy',
                      'createdBy'
                  )
                  .innerJoinAndSelect(
                      'credentialCollectionEntity.credentialCollectionUser',
                      'credentialCollectionUser',
                      `
                    credentialCollectionEntity.id = :id AND
                    credentialCollectionEntity.tenantId = :tenantId AND
                    credentialCollectionUser.user.id = :userId AND
                    credentialCollectionUser.privilegeType IN (:...privilegeTypes)
                `,
                      {
                          id,
                          tenantId: user.tenantId,
                          userId: user.id,
                          privilegeTypes: [
                              PrivilegeType.READ,
                              PrivilegeType.WRITE,
                          ],
                      }
                  )
                  .innerJoinAndSelect(
                      'credentialCollectionEntity.credentialCollectionUser',
                      'allCredentialCollectionUser'
                  )
                  .innerJoinAndSelect(
                      'allCredentialCollectionUser.user',
                      'user'
                  )
                  .getOne();

        if (!collection) {
            throw new NotFoundException('Could not find credential collection with id: ' + id);
        }

        return collection;
    }

    async findOneByCriteria(tenantId: string, criteria: Partial<CredentialCollection>) {
        const collection = await this.credentialCollectionRepository.findOne({
            where: {
                tenantId,
                ...criteria
            },
            relations: RELATIONS
        });

        if (!collection) {
            throw new NotFoundException('Could not find credential collection with given criteria');
        }

        return collection;
    }

    async update(id: string, updateCredentialCollectionDto: UpdateCredentialCollectionDto, user: User) {
        const credentialCollection = await this.findOneAccessibleById(id, user);

        const { sharedWith, ...dto } = updateCredentialCollectionDto;
        const { tenantId } = user;

        if (credentialCollection.createdById !== user.id && !isTenantAdmin(user)) {
            throw new ForbiddenException();
        }

        if (dto.accessType === AccessType.PRIVATE) {
            updateCredentialCollectionDto.sharedWith = [];
        }

        const credentialCollectionUserArray = await this.credentialCollectionUserRepository.find({
            where: {
                credentialCollectionId: id
            }
        });

        const credentialCollectionUserArrayToSave = await this.getCollectionUserArrayWithPrivileges(
            sharedWith,
            credentialCollection,
            tenantId
        );

        await this.credentialCollectionRepository.manager.transaction(
            async (manager) => {
                await Promise.all(
                    credentialCollectionUserArray.map((ccu) =>
                        manager.remove(CredentialCollectionUser, ccu)
                    )
                );
                await Promise.all(
                    credentialCollectionUserArrayToSave.map((ccu) =>
                        manager.save(CredentialCollectionUser, ccu)
                    )
                );

                await manager.update(CredentialCollection, id, dto).catch(async error => {
                    await this.throwErrorIfNameTaken(user.tenantId, dto.name, user.id, { id });

                    throw new BadRequestException(error.message);
                });
            }
        );

        return this.credentialCollectionRepository.findOne({
            where: { id },
            relations: RELATIONS
        });
    }

    async delete(id: string, user: User) {
        const collection = await this.credentialCollectionRepository.findOne({
            relations: RELATIONS,
            where: {
                id,
                tenantId: user.tenantId,
                ...(!isTenantAdmin(user) && {
                    credentialCollectionUser: {
                        userId: user.id,
                        privilegeType: PrivilegeType.WRITE,
                    },
                }),
            },
        });

        if (!collection) {
            throw new NotFoundException('Could not find credential collection with id: ' + id);
        }

        if (!isTenantAdmin(user) && collection.createdById !== user.id) {
            throw new ForbiddenException();
        }

        if (collection.credentials.length > 0) {
            throw new ConflictException('Collection cannot be deleted, there are credentials related to this collection');
        }

        await this.credentialCollectionRepository.delete(collection.id);
    }

    private async getCollectionUserArrayWithPrivileges(
        sharedWith: UpdateCredentialCollectionDto['sharedWith'],
        credentialCollection: CredentialCollection,
        tenantId: Tenant['id'],
    ) {
        if (!sharedWith) {
            return [
                this.credentialCollectionUserRepository.create({
                    credentialCollectionId: credentialCollection.id,
                    userId: credentialCollection.createdBy.id,
                    privilegeType: PrivilegeType.WRITE,
                }),
            ];
        }

        const userEmails = sharedWith.map(user => user.email);
        userEmails.push(credentialCollection.createdBy.email);

        const correctEmailCount = await this.userService.countByEmailsInTenant(
            userEmails, tenantId
        );

        if (userEmails.length !== correctEmailCount) {
            throw new BadRequestException('Some emails are not correct');
        }

        const grantAccessUsers = await this.userService.findByEmailsNotTenantAdmin(userEmails, tenantId);

        return grantAccessUsers.map(user => {
            if (user.email === credentialCollection.createdBy.email) {
                return this.credentialCollectionUserRepository.create({
                    credentialCollectionId: credentialCollection.id,
                    userId: user.id,
                    privilegeType: PrivilegeType.WRITE,
                });
            }

            const privilegeType = sharedWith.find(item => item.email === user.email)?.privilegeType ?? PrivilegeType.READ;

            return this.credentialCollectionUserRepository.create({
                credentialCollectionId: credentialCollection.id,
                userId: user.id,
                privilegeType
            });
        });
    }

    private async throwErrorIfNameTaken(tenantId: string, name: string, createdById: number, { id }: { id?: string } = {}) {
        const collection = await this.findOneByCriteria(tenantId, { name, createdById });

        const isNameTaken = id
            ? collection.id !== id
            : Boolean(await this.findOneByCriteria(tenantId, { name, createdById }));

        if (isNameTaken) {
            throw new BadRequestException(`Credential collection with name "${name}" already exists`);
        }
    }
}
