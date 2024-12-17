import {
    BadRequestException, Body, Controller, Delete, Get,
    HttpCode,
    HttpStatus,
    NotFoundException, Param, ParseUUIDPipe,
    Patch, Post
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';

import { FeatureKeys } from '#/auth/featureKey.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { Logger } from '#/utils/logger';
import { Public } from '#/auth/guards';
import { GetWithTenant, PostWithTenant } from '#/utils/decorators/with-tenant.decorator';

import { TenantService } from './tenant.service';
import { TenantInviteCodeDto, tenantInviteCodeSchema } from './dto/invite-code.dto';
import { CreateTenantDto, createTenantSchema } from './dto/create-tenant.dto';
import { UpdateTenantDto, updateTenantSchema } from './dto/update-tenant.dto';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { TenantCriteria } from './criteria/tenant.criteria';
import { Tenant } from './tenant.entity';

@Controller('/api/scheduler')
export class TenantController {
    private readonly logger = new Logger(TenantController.name);

    constructor(
        private readonly tenantService: TenantService
    ) { }

    @GetWithTenant('me')
    @FeatureKeys(FeatureKey.TENANT_READ)
    async getTenantByUser(
        @UserDecorator() { tenantId }: User,
    ) {
        const tenant = await this.tenantService.getById(tenantId);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', tenantId);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @GetWithTenant('invite-code')
    @FeatureKeys(FeatureKey.TENANT_GET_INVITE_CODE)
    async getActiveInviteCode(
        @UserDecorator() { tenantId }: User,
    ) {
        const inviteCodeDto = await this.tenantService.getActiveInviteCodeByTenantId(tenantId);

        if (!inviteCodeDto) {
            this.logger.error('Cannot find valid invite code for tenant with id: ', tenantId);
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @PostWithTenant('invite-code')
    @FeatureKeys(FeatureKey.TENANT_CREATE_INVITE_CODE)
    async createInviteCode(
        @UserDecorator() { tenantId }: User,
    ) {

        if (await this.tenantService.getActiveInviteCodeByTenantId(tenantId)) {
            this.logger.error('Valid code exists for tenant with id: ', tenantId);
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(tenantId);
    }

    // -------------- ENDPOINTS FOR ADMIN & ONE PUBLIC ------------------

    @Get('tenants')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    getAllTenants() {
        return this.tenantService.getAll();
    }

    @Get('tenants/Page')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    getAllTenantsByPage(
        @Pageable() paging: Paging,
        @Specifiable(TenantCriteria) specs: Specs<Tenant>,
    ) {
        return this.tenantService.getAllByPageWithSpecs(specs, paging);
    }

    @Get('tenants/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_GET_ALL_INVITE_CODE)
    async getActiveInviteCodeByTenant(
        @Param('tenantId') id: Tenant['id'],
    ) {
        const inviteCodeDto = await this.tenantService.getActiveInviteCodeByTenantId(id);

        if (!inviteCodeDto) {
            this.logger.error('Cannot find valid invite code for tenant with id: ', id);
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @Get('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    async getTenantById(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
    ) {
        const tenant = await this.tenantService.getById(id);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', id);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @Post('tenants/invite-code')
    @Public()
    @HttpCode(HttpStatus.OK)
    validateInviteCode(
        @Body(new ZodValidationPipe(tenantInviteCodeSchema)) inviteCodeDto: TenantInviteCodeDto,
    ) {
        return this.tenantService.validateInviteCode(inviteCodeDto);
    }

    @Post('tenants')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    createTenant(
        @Body(new ZodValidationPipe(createTenantSchema)) tenantDto: CreateTenantDto,
        @UserDecorator() user: User,
    ) {
        return this.tenantService.create(tenantDto, user);
    }

    @Post('tenants/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_CREATE_ALL_INVITE_CODE)
    async createInviteCodeByTenant(
        @Param('tenantId') id: Tenant['id'],
    ) {

        if (await this.tenantService.getActiveInviteCodeByTenantId(id)) {
            this.logger.error('Valid code exists for tenant with id: ', id);
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(id);
    }

    @Patch('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    updateTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
        @Body(new ZodValidationPipe(updateTenantSchema)) tenantDto: UpdateTenantDto,
        @UserDecorator() user: User
    ) {
        return this.tenantService.update(tenantDto, id, user);
    }

    @Delete('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
    ) {
        await this.tenantService.delete(id);
    }
}
