import {
    BadRequestException,
    Controller,
    NotFoundException,
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';

import { FeatureKeys } from '#/auth/featureKey.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import {
    GetWithTenant,
    PostWithTenant,
} from '#/utils/decorators/with-tenant.decorator';
import { Logger } from '#/utils/logger';

import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { LicenseService } from '../license/license.service';
import { TenantService } from './tenant.service';
import { SwaggerTags } from '#/utils/swagger.utils';
import { Tenant } from './tenant.entity';
import { TenantInviteCodeSwaggerDto } from './dto/invite-code.dto';
import { ApiDefaultAuthResponses } from '#/utils/decorators/swagger/ApiDefaultAuthResponses.decorator';

@ApiTags(SwaggerTags.TENANT_USERS)
@ApiDefaultAuthResponses()
@Controller('/api/scheduler')
export class TenantController {
    private readonly logger = new Logger(TenantController.name);

    constructor(
        private readonly tenantService: TenantService,
        private readonly licenseService: LicenseService
    ) {}

    @ApiOperation({
        summary: 'Get tenant for the current user',
        description:
            'Returns tenant information for the currently authenticated user based on their tenant ID.',
    })
    @ApiOkResponse({
        description: 'Tenant successfully retrieved.',
        type: Tenant,
    })
    @ApiNotFoundResponse({
        description: 'Tenant not found for the current user.',
    })
    @GetWithTenant('me')
    @FeatureKeys(FeatureKey.TENANT_READ)
    async getTenantByUser(@UserDecorator() { tenantId }: User) {
        const tenant = await this.tenantService.getById(tenantId);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', tenantId);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @ApiOperation({
        summary: 'Get active invite code for the current tenant',
        description:
            'Retrieves the currently active invite code assigned to the tenant of the logged-in user.',
    })
    @ApiOkResponse({
        description: 'Active invite code retrieved successfully.',
        type: TenantInviteCodeSwaggerDto,
    })
    @ApiNotFoundResponse({
        description: 'No valid invite code found for the tenant.',
    })
    @GetWithTenant('invite-code')
    @FeatureKeys(FeatureKey.TENANT_GET_INVITE_CODE)
    async getActiveInviteCode(@UserDecorator() { tenantId }: User) {
        const inviteCodeDto =
            await this.tenantService.getActiveInviteCodeByTenantId(tenantId);

        if (!inviteCodeDto) {
            this.logger.error(
                'Cannot find valid invite code for tenant with id: ',
                tenantId
            );
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @ApiOperation({
        summary: 'Create a new invite code for the tenant',
        description:
            'Creates a new invite code for the tenant if none currently exists. Fails if a valid code already exists.',
    })
    @ApiOkResponse({
        description: 'Invite code successfully created.',
        type: TenantInviteCodeSwaggerDto,
    })
    @ApiBadRequestResponse({
        description: 'A valid invite code already exists for this tenant.',
    })
    @PostWithTenant('invite-code')
    @FeatureKeys(FeatureKey.TENANT_CREATE_INVITE_CODE)
    async createInviteCode(@UserDecorator() { tenantId }: User) {
        if (await this.tenantService.getActiveInviteCodeByTenantId(tenantId)) {
            this.logger.error(
                'Valid code exists for tenant with id: ',
                tenantId
            );
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(tenantId);
    }
}
