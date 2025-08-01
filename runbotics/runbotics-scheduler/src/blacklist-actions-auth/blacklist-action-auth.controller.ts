import { Body, Controller, Post } from '@nestjs/common';
import { BlacklistActionAuthService } from '#/blacklist-actions-auth/blacklist-action-auth.service';

@Controller('api/scheduler/blacklist-action-auth')
export class BlacklistActionAuthController {
    constructor(private readonly blacklistActionAuthService: BlacklistActionAuthService) {
    }
    
    @Post('/check')
    async checkDefinition(@Body() body: { definition: string }) {
        return this.blacklistActionAuthService.checkProcessActionsBlacklistByDefinition(body.definition);
    }
}
