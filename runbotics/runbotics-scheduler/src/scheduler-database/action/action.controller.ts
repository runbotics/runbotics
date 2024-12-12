import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { CreateActionDto, createActionSchema } from './dto/create-action.dto';
import { UpdateActionDto, updateActionSchema } from './dto/update-action.dto';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '../user/user.entity';


@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/actions')
export class ActionController {
    private readonly logger = new Logger(ActionController.name);

    constructor(
        private readonly actionService: ActionService,
    ) {}

    @Get()
    @FeatureKeys(FeatureKey.EXTERNAL_ACTION_READ)
    getAllActions(
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to get all actions');
        return this.actionService.getAll(tenantId);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.EXTERNAL_ACTION_READ)
    getAction(
        @Param('id') id: string,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to get action by id: ', id);
        const action = this.actionService.getById(tenantId, id);

        if (!action) {
            this.logger.error('Cannot find action with id: ', id);
            throw new NotFoundException('Action not found');
        }

        return action;
    }

    @Post()
    @FeatureKeys(FeatureKey.EXTERNAL_ACTION_ADD)
    createAction(
        @UserDecorator() { tenantId }: User,
        @Body(new ZodValidationPipe(createActionSchema)) createActionDto: CreateActionDto
    ) {
        this.logger.log('REST request to create new action');
        return this.actionService.create(tenantId, createActionDto);
    }

    @Patch(':id')
    @FeatureKeys(FeatureKey.EXTERNAL_ACTION_EDIT)
    updateAction(
        @Param('id') id: string,
        @UserDecorator() { tenantId }: User,
        @Body(new ZodValidationPipe(updateActionSchema)) updateActionDto: UpdateActionDto
    ) {
        this.logger.log('REST request to edit action with id: ', id);
        return this.actionService.update(id, tenantId, updateActionDto);
    }

    @Delete(':id')
    @FeatureKeys(FeatureKey.EXTERNAL_ACTION_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAction(
        @Param('id') id: string,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to delete action with id: ', id);
        await this.actionService.delete(tenantId, id);
    }
}
