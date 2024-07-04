import {
    BadRequestException, Body, Controller, Get,
    NotFoundException, Param, ParseUUIDPipe, Patch,
    Post, UseInterceptors
} from '@nestjs/common';
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
    async getTenantByUser(@User('tenantId') id: Tenant['id']) {
        this.logger.log('REST request to get user tenant with id: ', id);
        const tenant = await this.tenantService.getById(id);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', id);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @Get('/:tenantId/invite-code')
    @UseInterceptors(TenantInterceptor)
    @FeatureKeys(FeatureKey.TENANT_GET_INVITE_CODE)
    async getActiveInviteCode(@User('tenantId') id: Tenant['id']) {
        this.logger.log('REST request to get active invite code for user tenant with id: ', id);
        const inviteCodeDto = await this.tenantService.getActiveInviteCodeByTenantId(id);

        if (!inviteCodeDto) {
            this.logger.error('Cannot find valid invite code for tenant with id: ', id);
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @Post('/:tenantId/invite-code')
    @UseInterceptors(TenantInterceptor)
    @FeatureKeys(FeatureKey.TENANT_CREATE_INVITE_CODE)
    async createInviteCode(@User('tenantId') id: Tenant['id']) {
        this.logger.log('REST request to create invite code for user tenant with id: ', id);

        if (await this.tenantService.getActiveInviteCodeByTenantId(id)) {
            this.logger.error('Valid code exists for tenant with id: ', id);
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(id);
    }

    // -----------------------------------

    @Get() // TODO: pagination & filtering
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    getAllTenants() {
        this.logger.log('REST request to get all tenants');
        return this.tenantService.getAll();
    }

    @Get('/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_GET_ALL_INVITE_CODE)
    async getActiveInviteCodeByTenant(@Param('tenantId') id: Tenant['id']) {
        this.logger.log(`REST request to get tenant invite code for tenant with id: ${id}`);
        const inviteCodeDto = await this.tenantService.getActiveInviteCodeByTenantId(id);

        if (!inviteCodeDto) {
            this.logger.error('Cannot find valid invite code for tenant with id: ', id);
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @Get('/:id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    async getTenantById(
        @Param('id', ParseUUIDPipe) id: Tenant['id']
    ) {
        this.logger.log('REST request to get tenant by id: ', id);
        const tenant = await this.tenantService.getById(id);

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
        return this.tenantService.create(tenantDto, user);
    }

    @Post('/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_CREATE_ALL_INVITE_CODE)
    async createInviteCodeByTenant(@Param('tenantId') id: Tenant['id']) {
        this.logger.log('REST request to create tenant invite code for tenant with id: ', id);

        if (await this.tenantService.getActiveInviteCodeByTenantId(id)) {
            this.logger.error('Valid code exists for tenant with id: ', id);
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(id);
    }

    @Patch('/:id')
    @FeatureKeys(FeatureKey.TENANT_ALL_ACCESS)
    updateTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
        @Body(new ZodValidationPipe(updateTenantSchema)) tenantDto: UpdateTenantDto,
        @User() user: UserEntity
    ) {
        this.logger.log(`REST request to update tenant with id ${id} by user with id: ${user.id}`);
        return this.tenantService.update(tenantDto, id, user);
    }
}
