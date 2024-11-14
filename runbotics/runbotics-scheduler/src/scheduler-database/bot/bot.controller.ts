import {
    Controller,
    Get, Param, ParseIntPipe,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { User } from '#/utils/decorators/user.decorator';
import { User as UserEntity } from '#/scheduler-database/user/user.entity';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { BotCrudService } from '#/scheduler-database/bot/bot-crud.service';
import { BotCriteria } from '#/scheduler-database/bot/criteria/bot.criteria';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/bots')
export class BotController {
    constructor(
        private readonly botCrudService: BotCrudService,
    ) {
    }

    @Get()
    @FeatureKeys(FeatureKey.BOT_READ)
    getAll(
        @Specifiable(BotCriteria) specs: Specs<BotEntity>,
        @User() user: UserEntity,
    ){
        return this.botCrudService.findAll(user, specs);
    }

    @Get('GetPage')
    @FeatureKeys(FeatureKey.BOT_READ)
    getAllPage(
        @Specifiable(BotCriteria) specs: Specs<BotEntity>,
        @Pageable() paging: Paging,
        @User() user: UserEntity,
    ){
        return this.botCrudService.findAllPage(user, specs, paging);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.BOT_READ)
    get(
        @Param('id', ParseIntPipe) id: number,
        @User() user: UserEntity,
    ){
        return this.botCrudService.findOne(user, id);
    }
}
