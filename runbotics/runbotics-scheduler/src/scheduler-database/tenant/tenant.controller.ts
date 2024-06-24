import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { FeatureKey, Tenant } from 'runbotics-common';

import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User } from '#/utils/decorators/user.decorator';
import { UserEntity } from '#/database/user/user.entity';
import { TenantService } from './tenant.service';
import { CreateTenantDto, createTenantSchema } from './dto/create-tenant.dto';

@Controller('/api/scheduler/tenants')
export class TenantController {
    constructor(
        private readonly tenantService: TenantService
    ) { }

    @Get()
    @FeatureKeys(FeatureKey.TENANT_READ)
    getTenantByUser(@User() user: UserEntity) {

    }

    @Get(':id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    getTenantById(
        @Param('id', ParseUUIDPipe) id: Tenant['id']
    ) {

    }

    @Get('all')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    getAllTenants() { }

    @Get('all-page')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    getAllTenantsByPage() { }

    @Post()
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    createTenant(
        @Body(new ZodValidationPipe(createTenantSchema)) body: CreateTenantDto,
        @User() user: UserEntity
    ) {
        return body;
    }

    @Patch(':id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    updateTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id']
    ) {

    }
}
