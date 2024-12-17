import {
    Body, Controller, Delete, Get, HttpCode,
    HttpStatus, NotFoundException, Param,
    ParseIntPipe, Patch, Post, UseInterceptors
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';

import { Logger } from '#/utils/logger';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

import { GlobalVariableService } from './global-variable.service';
import { CreateGlobalVariableDto, createGlobalVariableSchema } from './dto/create-global-variable.dto';
import { UpdateGlobalVariableDto, updateGlobalVariableSchema } from './dto/update-global-variable.dto';


@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/global-variables')
export class GlobalVariableController {
    private readonly logger = new Logger(GlobalVariableController.name);

    constructor(
        private readonly globalVariableService: GlobalVariableService,
    ) {}

    @Get() // TODO: pagination & filtering
    @FeatureKeys(FeatureKey.GLOBAL_VARIABLE_READ)
    getAllGlobalVariables(
        @UserDecorator() { id, tenantId }: User,
    ) {
        this.logger.log('REST request to get all global variables by user with id: ', id);
        return this.globalVariableService.getAll(tenantId);
    }

    @Get(':id')
    @FeatureKeys(FeatureKey.GLOBAL_VARIABLE_READ)
    async getGlobalVariable(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() { tenantId }: User,
    ) {
        this.logger.log('REST request to get global variable by id: ', id);
        const globalVariable = await this.globalVariableService.getById(tenantId, id);

        if (!globalVariable) {
            this.logger.error('Cannot find global variable with id: ', id);
            throw new NotFoundException('Global variable not found');
        }

        return globalVariable;
    }

    @Post()
    @FeatureKeys(FeatureKey.GLOBAL_VARIABLE_ADD)
    createGlobalVariable(
        @Body(new ZodValidationPipe(createGlobalVariableSchema)) globalVariableDto: CreateGlobalVariableDto,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to create global variable by user with id: ', user.id);
        return this.globalVariableService.create(user.tenantId, user, globalVariableDto);
    }

    @Patch(':id')
    @FeatureKeys(FeatureKey.GLOBAL_VARIABLE_EDIT)
    updateGlobalVariable(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(updateGlobalVariableSchema)) globalVariableDto: UpdateGlobalVariableDto,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to update global variable with id: ', id);
        return this.globalVariableService.update(user.tenantId, user, globalVariableDto, id);
    }

    @Delete(':id')
    @FeatureKeys(FeatureKey.GLOBAL_VARIABLE_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteGlobalVariableBy(
        @Param('id', ParseIntPipe) id: number,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to delete global variable with id: ', id);
        await this.globalVariableService.delete(user.tenantId, user, id);
    }
}
