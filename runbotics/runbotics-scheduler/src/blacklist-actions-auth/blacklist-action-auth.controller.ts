import { Body, Controller, Post } from '@nestjs/common';
import { BlacklistActionAuthService } from '#/blacklist-actions-auth/blacklist-action-auth.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTags } from '#/utils/swagger.utils';

@ApiTags(SwaggerTags.BLACKLIST_AUTH)
@Controller('api/scheduler/blacklist-action-auth')
export class BlacklistActionAuthController {
    constructor(private readonly blacklistActionAuthService: BlacklistActionAuthService) {
    }

    @ApiOperation({ summary: 'Check if a process is blacklisted by its definition' })
    @Post('/check')
    async checkDefinition(@Body() body: { definition: string }) {
        return this.blacklistActionAuthService.checkProcessActionsBlacklistByDefinition(body.definition);
    }
}
