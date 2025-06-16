import { BotCollectionService } from '#/scheduler-database/bot-collection/bot-collection.service';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import {
    CreateBotCollectionDto,
    createBotCollectionSchema,
} from '#/scheduler-database/bot-collection/dto/create-bot-collection.dto';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { UpdateBotCollectionDto } from '#/scheduler-database/bot-collection/dto/update-bot-collection.dto';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { BotCollectionCriteria } from '#/scheduler-database/bot-collection/criteria/bot-collection.criteria';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/bot-collections')
export class BotCollectionController {
    constructor(
        private readonly botCollectionService: BotCollectionService,
    ) {
    }

    @Get()
    @FeatureKeys(FeatureKey.BOT_COLLECTION_READ)
    getForCurrentUser(
        @Specifiable(BotCollectionCriteria) specs: Specs<BotCollection>,
        @UserDecorator() user: User,
    ){
        return this.botCollectionService.findForUser(user, specs);
    }

    @Get('GetPage')
    @FeatureKeys(FeatureKey.BOT_COLLECTION_READ)
    getPageForCurrentUser(
        @Specifiable(BotCollectionCriteria) specs: Specs<BotCollection>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User,
    ){
        return this.botCollectionService.findPageForUser(user, specs, paging);
    }

    @Post()
    @FeatureKeys(FeatureKey.BOT_COLLECTION_ADD)
    create(
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createBotCollectionSchema)) collectionDto: CreateBotCollectionDto,
    ){
        return this.botCollectionService.saveDto(user, collectionDto);
    }

    @Patch(':id')
    @FeatureKeys(FeatureKey.BOT_COLLECTION_EDIT)
    async update(
        @Param('id') id: string,
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createBotCollectionSchema)) collectionDto: UpdateBotCollectionDto,
    ) {
        if (await this.botCollectionService.isDefaultCollection(id)) {
            throw new BadRequestException('Can not modify default collection');
        }

        return this.botCollectionService.updateDto(id, user, collectionDto);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.BOT_COLLECTION_READ)
    getById(
        @Param('id') id: string,
        @UserDecorator() user: User,
    ){
        return this.botCollectionService.findById(id, user);
    }

    @Delete(':id')
    @FeatureKeys(FeatureKey.BOT_COLLECTION_DELETE)
    async delete(
        @Param('id') id: string,
        @UserDecorator() user: User,
    ){
        if (await this.botCollectionService.isDefaultCollection(id)) {
            throw new BadRequestException('Cannot delete default collection');
        }

        return this.botCollectionService.delete(id, user);
    }
}
