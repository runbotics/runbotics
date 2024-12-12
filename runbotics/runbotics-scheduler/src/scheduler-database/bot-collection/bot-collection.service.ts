import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, In, Repository, And, Equal, FindOperator } from 'typeorm';
import { IBotCollection, FeatureKey } from 'runbotics-common';
import { BotCollection } from './bot-collection.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { CreateBotCollectionDto } from '#/scheduler-database/bot-collection/dto/create-bot-collection.dto';
import { UpdateBotCollectionDto } from '#/scheduler-database/bot-collection/dto/update-bot-collection.dto';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { DefaultCollections } from 'runbotics-common';
import { UserService } from '../user/user.service';

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
        private readonly userService: UserService,
    ) {
    }

    getById(id: string): Promise<BotCollection> {
        return this.botCollectionRepository.findOne({ where: { id }, relations: RELATIONS });
    }

    async save(botCollection: IBotCollection) {
        await this.botCollectionRepository.save(botCollection);
        return botCollection;
    }

    async saveDto(user: User, collectionDto: CreateBotCollectionDto) {
        const collection = new BotCollection();
        collection.name = collectionDto.name;
        collection.description = collectionDto.description;
        collection.publicBotsIncluded = collectionDto.publicBotsIncluded;
        collection.createdByUser = user;
        collection.tenantId = user.tenantId;

        if (collectionDto.users) {
            const userIds = collectionDto.users.map(user => user.id);
            const users = await this.userRepository.findBy({ id: In(userIds), tenantId: user.tenantId });
            if (users.length !== userIds.length) {
                throw new BadRequestException('Invalid users provided for bot collection');
            }
            collection.users = users;
        }

        return this.botCollectionRepository.save(collection);
    }

    async updateDto(id: string, user: User, collectionDto: UpdateBotCollectionDto) {
        const collection = await this.botCollectionRepository
            .findOneByOrFail({ tenantId: user.tenantId, id })
            .catch(() => {
                throw new NotFoundException();
            });
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

        await this.botCollectionRepository.save(collection);

        return collection;
    }

    findAll(user: User, specs: Specs<BotCollection>) {
        const options: FindManyOptions<BotCollection> = {};
        options.where = {
            ...specs.where,
            tenantId: user.tenantId,
        };

        options.order = specs.order;
        options.relations = RELATIONS;

        return this.botCollectionRepository.find(options);
    }

    findAllPage(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options: FindManyOptions<BotCollection> = {};
        options.where = {
            ...specs.where,
            tenantId: user.tenantId,
        };

        options.order = specs.order;

        options.skip = paging.skip;
        options.take = paging.take;
        options.relations = RELATIONS;

        return getPage(this.botCollectionRepository, options);
    }

    findById(id: string, user: User) {
        return this.botCollectionRepository.find({ where: { tenantId: user.tenantId, id }, relations: RELATIONS });
    }

    delete(id: string, user: User) {
        return this.botCollectionRepository.delete({ id, tenantId: user.tenantId });
    }


    findForUser(user: User, specs: Specs<BotCollection>) {
        if (this.userService.hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            return this.botCollectionRepository.find(
                {
                    where: [
                        {
                            tenantId: user.tenantId,
                            name: specs.where.name,
                        },
                        {
                            name: specs.where.name ?
                                And(Equal(DefaultCollections.GUEST), specs.where.name as FindOperator<string>)
                                : DefaultCollections.GUEST,
                        },
                        {
                            name: specs.where.name ?
                                And(Equal(DefaultCollections.PUBLIC), specs.where.name as FindOperator<string>)
                                : DefaultCollections.PUBLIC,
                        },
                    ],
                    relations: RELATIONS,
                });
        }

        return this.botCollectionRepository.find({
            relations: RELATIONS,
            where: [
                {
                    tenantId: user.tenantId,
                    users: {
                        id: user.id,
                    },
                    name: specs.where.name,
                },
                {
                    tenantId: user.tenantId,
                    createdByUser: user,
                    name: specs.where.name,
                },
                {
                    name: specs.where.name ?
                        And(Equal(DefaultCollections.GUEST), specs.where.name as FindOperator<string>)
                        : DefaultCollections.GUEST,
                },
                {
                    name: specs.where.name ?
                        And(Equal(DefaultCollections.PUBLIC), specs.where.name as FindOperator<string>)
                        : DefaultCollections.PUBLIC,
                },
            ],
        }).then(collections => collections.map(collection => ({
            ...collection,
            createdByUser: this.userService.mapToBasicUserDto(collection.createdByUser),
            users: collection.users.map(user => this.userService.mapToBasicUserDto(user)),
        })));
    }

    async findIdsForAdmin(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options: FindManyOptions<BotCollection> =
            {
                ...paging,
                where: [
                    {
                        tenantId: user.tenantId,
                        name: specs.where.name,
                    },
                    {
                        name: specs.where.name ?
                            And(Equal(DefaultCollections.GUEST), specs.where.name as FindOperator<string>)
                            : DefaultCollections.GUEST,
                    },
                    {
                        name: specs.where.name ?
                            And(Equal(DefaultCollections.PUBLIC), specs.where.name as FindOperator<string>)
                            : DefaultCollections.PUBLIC,
                    },
                ],
                relations: RELATIONS,
            };

        const page = await getPage(this.botCollectionRepository, options);

        return page.content.map(collection => collection.id);
    }

    async findIds(user: User, specs: Specs<BotCollection>, paging: Paging) {
        if (this.userService.hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            return this.findIdsForAdmin(user, specs, paging);
        }
        return this.findIdsForUser(user, specs, paging);
    }

    async findIdsForUser(user: User, specs: Specs<BotCollection>, paging: Paging) {
        const options: FindManyOptions<BotCollection> = {
            select: {
                id: true,
            },
            relations: RELATIONS,
            ...paging,
            where: [
                {
                    tenantId: user.tenantId,
                    users: {
                        id: user.id,
                    },
                    name: specs.where.name,
                },
                {
                    tenantId: user.tenantId,
                    createdByUser: {
                        id: user.id,
                    },
                    name: specs.where.name,
                },
                {
                    name: specs.where.name ?
                        And(Equal(DefaultCollections.GUEST), specs.where.name as FindOperator<string>)
                        : DefaultCollections.GUEST,
                },
                {
                    name: specs.where.name ?
                        And(Equal(DefaultCollections.PUBLIC), specs.where.name as FindOperator<string>)
                        : DefaultCollections.PUBLIC,
                },
            ],
        };

        const page = await getPage(this.botCollectionRepository, options);

        return page.content.map(collection => collection.id);
    }

    async findPageForUser(user: User, specs: Specs<BotCollection>, paging: Paging) {
        // preserved java version functionality
        if (this.userService.hasFeatureKey(user, FeatureKey.BOT_COLLECTION_ALL_ACCESS)) {
            const ids = await this.findIdsForAdmin(user, specs, paging);
            const options: FindManyOptions<BotCollection> = {
                where: { tenantId: user.tenantId, id: In(ids) },
                relations: RELATIONS,
            };

            const page = await getPage(this.botCollectionRepository, options);

            return {
                ...page,
                content: page.content.map(collection => ({
                    ...collection,
                    createdByUser: this.userService.mapToBasicUserDto(collection.createdByUser),
                    users: collection.users.map(user => this.userService.mapToBasicUserDto(user)),
                }))
            };
        }

        const ids = await this.findIdsForUser(user, specs, paging);
        const options: FindManyOptions<BotCollection> = {
            where: { tenantId: user.tenantId, id: In(ids) },
            relations: RELATIONS,
        };

        const page = await getPage(this.botCollectionRepository, options);

        return {
            ...page,
            content: page.content.map(collection => ({
                ...collection,
                createdByUser: this.userService.mapToBasicUserDto(collection.createdByUser),
                users: collection.users.map(user => this.userService.mapToBasicUserDto(user)),
            }))
        };
    }

    async isDefaultCollection(id: string) {
        const collection = await this.botCollectionRepository.findOneByOrFail({ id });

        return (Object.values(DefaultCollections) as string[]).includes(collection.name);
    }
}
