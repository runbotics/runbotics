import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { BotEntity } from './bot.entity';
import {
    IBot,
    FeatureKey,
} from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage } from '#/utils/page/page';
import { BotCollectionService } from '#/scheduler-database/bot-collection/bot-collection.service';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';

const relations = ['user', 'system', 'collection', 'collection.users'];

@Injectable()
export class BotCrudService {
    constructor(
        @InjectRepository(BotEntity)
        private botRepository: Repository<BotEntity>,
        private botCollectionService: BotCollectionService,
    ) {
    }

    async findAll(user: UserEntity, specs: Specs<BotEntity>): Promise<IBot[]> {
        const collectionIds = await this.botCollectionService.findIds(
            user,
            { where: {}, order: { created: 'asc' } },
            { take: 1000, skip: 0 },
        );

        const options: FindManyOptions<BotEntity> = {
            ...specs.order,
            where: {
                ...specs.where,
                collection: {
                    id: In(collectionIds),
                },
                tenantId: user.tenantId,
            },
            relations,
        };

        return this.botRepository.find(options);
    }

    async findAllPage(user: UserEntity, specs: Specs<BotEntity>, paging: Paging) {
        const collectionIds = user.hasFeatureKey(FeatureKey.TENANT_ALL_ACCESS) ?
            await this.botCollectionService.findIdsForAdmin(
                user,
                {
                    where: {},
                    order: { created: 'asc' },
                },
                { take: 1000, skip: 0 },
            )
            : await this.botCollectionService.findIdsForUser(
                user,
                {
                    where: {},
                    order: { created: 'asc' },
                },
                { take: 1000, skip: 0 },
            );

        const options: FindManyOptions<BotEntity> = {
            ...specs.order,
            ...paging,
            where: {
                ...specs.where,
                collection: {
                    ...specs.where.collection as FindOptionsWhere<BotCollection>,
                    id: In(collectionIds),
                },
            },
            relations,
        };

        return getPage(this.botRepository, options);
    }

    async findOne(user: UserEntity, id: number) {
        const collectionIds = await this.botCollectionService.findIds(
            user,
            { where: {}, order: { created: 'asc' } },
            { take: 1000, skip: 0 },
        );

        const bot = await this.botRepository
            .findOneByOrFail({ tenantId: user.tenantId, id })
            .catch(() => {
                throw new NotFoundException();
            });

        if (!collectionIds.includes(bot.collectionId)) {
            throw new ForbiddenException();
        }

        return bot;
    }
}
