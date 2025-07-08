import { Logger } from '#/utils/logger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Public } from '#/auth/guards';
import { ZodValidationPipe } from 'nestjs-zod';
import { TenantInviteCodeDto, tenantInviteCodeSchema, TenantInviteCodeSwaggerDto } from './dto/invite-code.dto';
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from '#/utils/swaggerTags';

@ApiTags(SwaggerTags.TENANT_PUBLIC)
@Controller('/api/scheduler')
export class TenantPublicController {
    private readonly logger = new Logger(TenantPublicController.name);

    constructor(
        private readonly tenantService: TenantService,
    ) {}
    
    // -------------- ENDPOINTS FOR PUBLIC ------------------

  @Post('tenants/invite-code')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Validate invite code',
        description: 'Validates an invite code and returns the associated tenant name if the code is valid and not expired.',
    })
    @ApiBody({
        type: TenantInviteCodeSwaggerDto,
        description: 'Invite code payload. Should contain a valid and not expired invite code.',
    })
    @ApiOkResponse({
        description: 'Invite code is valid. Tenant name is returned.',
        schema: {
            type: 'object',
            properties: {
                tenantName: {
                    type: 'string',
                    example: 'ACME Corp'
                }
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Invite code is missing, invalid, or expired.',
    })
    validateInviteCode(
        @Body(new ZodValidationPipe(tenantInviteCodeSchema))
        inviteCodeDto: TenantInviteCodeDto
    ) {
        return this.tenantService.validateInviteCode(inviteCodeDto);
    }
}

