import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';

import { FeatureKeys } from '#/auth/featureKey.decorator';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { Logger } from '#/utils/logger';

import { TenantService } from './tenant.service';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import {
    Specifiable,
    Specs,
} from '#/utils/specification/specifiable.decorator';
import { TenantCriteria } from './criteria/tenant.criteria';
import { Tenant } from './tenant.entity';
import { CreateTenantDto, createTenantSchema } from './dto/create-tenant.dto';
import {
    UpdateTenantDto,
    updateTenantSchema,
    UpdateTenantSwaggerDto,
} from './dto/update-tenant.dto';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import {
    SwaggerTags,
    tenantIdSwaggerObjectDescription,
} from '#/utils/swagger.utils';
import { ApiDefaultAuthResponses } from '#/utils/decorators/swagger/ApiDefaultAuthResponses.decorator';
import { TenantInviteCodeSwaggerDto } from './dto/invite-code.dto';

@ApiTags(SwaggerTags.TENANT_ROLE_ADMIN)
@ApiDefaultAuthResponses()
@Controller('/api/scheduler')
export class TenantRoleAdminController {
    private readonly logger = new Logger(TenantRoleAdminController.name);

    constructor(private readonly tenantService: TenantService) {}

    // -------------- ENDPOINTS FOR ADMIN ------------------

    @ApiOperation({
        summary: 'Get all tenants',
        description:
            'Retrieves a list of all tenants in the system along with their related entities.',
    })
    @ApiOkResponse({
        description: 'List of tenants successfully retrieved.',
        type: Tenant,
        isArray: true,
    })
    @Get('tenants')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    getAllTenants() {
        return this.tenantService.getAll();
    }

    @ApiOperation({
        summary: 'Get paginated and filtered list of tenants',
        description:
            'Returns a paginated list of tenants. Supports dynamic filtering and sorting through query parameters.',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        example: 0,
        description: 'Page number (zero-based)',
    })
    @ApiQuery({
        name: 'size',
        required: false,
        type: Number,
        example: 10,
        description: 'Page size (number of records)',
    })
    @ApiQuery({
        name: 'sort',
        required: false,
        example: 'name,asc',
        description: 'Sorting (field,direction)',
    })
    @ApiQuery({
        name: 'name.eq',
        required: false,
        example: 'Acme Corp',
        description: 'Filter by name (e.g., name.eq=Acme Corp)',
    })
    @ApiBadRequestResponse({
        description: 'Invalid pagination or filtering parameters.',
    })
    @Get('tenants/Page')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    getAllTenantsByPage(
        @Pageable() paging: Paging,
        @Specifiable(TenantCriteria) specs: Specs<Tenant>
    ) {
        return this.tenantService.getAllByPageWithSpecs(specs, paging);
    }

    @ApiOperation({
        summary: 'Get active invite code for a specific tenant',
        description:
            'Retrieves the currently active invite code associated with the given tenant ID.',
    })
    @ApiParam(tenantIdSwaggerObjectDescription)
    @ApiOkResponse({
        description: 'Active invite code retrieved successfully.',
        type: TenantInviteCodeSwaggerDto,
    })
    @ApiNotFoundResponse({
        description: 'No valid invite code found for the specified tenant.',
    })
    @Get('tenants/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_GET_ALL_INVITE_CODE)
    async getActiveInviteCodeByTenant(@Param('tenantId') id: Tenant['id']) {
        const inviteCodeDto =
            await this.tenantService.getActiveInviteCodeByTenantId(id);

        if (!inviteCodeDto) {
            this.logger.error(
                'Cannot find valid invite code for tenant with id: ',
                id
            );
            throw new NotFoundException('Invite code not found');
        }

        return inviteCodeDto;
    }

    @ApiOperation({
        summary: 'Get tenant by ID',
        description: 'Fetches tenant details for the specified tenant ID.',
    })
    @ApiParam(tenantIdSwaggerObjectDescription)
    @ApiOkResponse({
        description: 'Tenant successfully retrieved.',
        type: Tenant,
    })
    @ApiNotFoundResponse({
        description: 'Tenant not found with the given ID.',
    })
    @Get('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    async getTenantById(@Param('id', ParseUUIDPipe) id: Tenant['id']) {
        const tenant = await this.tenantService.getById(id);

        if (!tenant) {
            this.logger.error('Cannot find tenant with id: ', id);
            throw new NotFoundException('Tenant not found');
        }

        return tenant;
    }

    @ApiOperation({
        summary: 'Create a new tenant',
        description:
            'Creates a new tenant with the specified name. The name must be unique.',
    })
    @ApiCreatedResponse({
        description: 'Tenant successfully created.',
        type: Tenant,
    })
    @ApiBadRequestResponse({
        description: 'Tenant name already exists or validation failed.',
    })
    @Post('tenants')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    createTenant(
        @Body(new ZodValidationPipe(createTenantSchema))
        tenantDto: CreateTenantDto,
        @UserDecorator() user: User
    ) {
        return this.tenantService.create(tenantDto, user);
    }

    @ApiOperation({
        summary: 'Create a new tenant invite-code',
        description:
            'If it does not have one yet, it creates a new tenant invite code.',
    })
    @ApiBadRequestResponse({
        description: 'Valid code exists for tenant',
    })
    @ApiNotFoundResponse({
        description: 'Cannot find tenant with given id',
    })
    @ApiCreatedResponse({
        description: 'Tenant invite-code successfully created.',
        type: TenantInviteCodeSwaggerDto,
    })
    @ApiParam(tenantIdSwaggerObjectDescription)
    @Post('tenants/invite-code/:tenantId')
    @FeatureKeys(FeatureKey.TENANT_CREATE_ALL_INVITE_CODE)
    async createInviteCodeByTenant(@Param('tenantId') id: Tenant['id']) {
        if (await this.tenantService.getActiveInviteCodeByTenantId(id)) {
            this.logger.error('Valid code exists for tenant with id: ', id);
            throw new BadRequestException('Valid code exists for tenant');
        }

        return this.tenantService.createInviteCodeByTenantId(id);
    }

    @ApiOperation({
        summary: 'Updates tenant information',
        description:
            'Allows updating the tenants name and/or email trigger whitelist. The tenant name must be unique. All changes are logged with the modifying user.',
    })
    @ApiBody({
        type: UpdateTenantSwaggerDto,
        examples: {
            example1: {
                summary: 'Update tenant name only',
                value: {
                    name: 'new-tenant-name',
                },
            },
            example2: {
                summary: 'Update email trigger whitelist only',
                value: {
                    emailTriggerWhitelist: [
                        'user1@example.com',
                        'user2@example.com',
                    ],
                },
            },
            example3: {
                summary: 'Update both name and email trigger whitelist',
                value: {
                    name: 'updated-tenant',
                    emailTriggerWhitelist: [
                        'admin@tenant.com',
                        'alerts@tenant.com',
                    ],
                },
            },
        },
    })
    @ApiParam(tenantIdSwaggerObjectDescription)
    @ApiOkResponse({
        description: 'Tenant update succesful',
        type: Tenant,
    })
    @ApiBadRequestResponse({
        description:
            'Cannot find tenant with provided id or name already exist.',
    })
    @Patch('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    updateTenant(
        @Param('id', ParseUUIDPipe) id: Tenant['id'],
        @Body(new ZodValidationPipe(updateTenantSchema))
        tenantDto: UpdateTenantDto,
        @UserDecorator() user: User
    ) {
        return this.tenantService.update(tenantDto, id, user);
    }

    @ApiOperation({
        summary: 'Delete tenant',
        description: 'Allows to delete tenant by id that was given.',
    })
    @ApiParam(tenantIdSwaggerObjectDescription)
    @ApiNoContentResponse({
        description: 'Tenant deleted successfully.',
    })
    @ApiBadRequestResponse({
        description:
            'Cannot find tenant with provided id or cannot delete tenant related to other resources',
    })
    @Delete('tenants/:id')
    @FeatureKeys(FeatureKey.MANAGE_ALL_TENANTS)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteTenant(@Param('id', ParseUUIDPipe) id: Tenant['id']) {
        await this.tenantService.delete(id);
    }
}
