import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { FeatureKey, Tenant } from 'runbotics-common';

import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User } from '#/utils/decorators/user.decorator';
import { UserEntity } from '#/database/user/user.entity';
import { Logger } from '#/utils/logger';

import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { TenantService } from './tenant.service';
import { CreateTenantDto, createTenantSchema } from './dto/create-tenant.dto';
import { UpdateTenantDto, updateTenantSchema } from './dto/update-tenant.dto';

@Controller('/api/scheduler/tenants')
export class TenantController {
    private readonly logger = new Logger(TenantController.name);

    constructor(
        private readonly tenantService: TenantService
    ) { }

    @Get('/:tenantId/me')
    @UseInterceptors(TenantInterceptor)
    @FeatureKeys(FeatureKey.TENANT_READ)
    async getTenantByUser(@User('tenantId') tenantId: string) {
        this.logger.log('REST request to get user tenant with id: ', tenantId);
        const tenant = await this.tenantService.getTenantById(tenantId);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', tenantId);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @Get() // TODO: pagination & filtering
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    getAllTenants() {
        this.logger.log('REST request to get all tenants');
        return this.tenantService.getAllTenants();
    }

    @Get('/:id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    async getTenantById(
        @Param('id', ParseUUIDPipe) id: Tenant['id']
    ) {
        this.logger.log('REST request to get tenant by id: ', id);
        const tenant = await this.tenantService.getTenantById(id);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', id);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @Post()
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    createTenant(
        @Body(new ZodValidationPipe(createTenantSchema)) tenantDto: CreateTenantDto,
        @User() user: UserEntity
    ) {
        this.logger.log('REST request to create tenant by user with id: ', user.id);
        return this.tenantService.createTenant(tenantDto, user);
    }

    @Patch('/:id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    updateTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
        @Body(new ZodValidationPipe(updateTenantSchema)) tenantDto: UpdateTenantDto,
        @User() user: UserEntity
    ) {
        this.logger.log(`REST request to update tenant with id ${id} by user with id: ${user.id}`);
        return this.tenantService.updateTenant(tenantDto, id, user);
    }
}
