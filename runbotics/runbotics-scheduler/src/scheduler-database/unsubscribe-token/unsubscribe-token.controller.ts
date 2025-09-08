import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { UnsubscribeTokenService } from './unsubscribe-token.service';
import { ProcessSummaryNotificationSubscribersService } from '../process-summary-notification-subscribers/process-summary-notification-subscribers.service';
import { Public } from '#/auth/guards';
import {Logger} from "#/utils/logger";


@Controller('api/scheduler/unsubscribe')
export class UnsubscribeTokenController {
    private readonly logger = new Logger(UnsubscribeTokenService.name);
    
    constructor(
        private readonly unsubscribeTokenService: UnsubscribeTokenService,
        private readonly subscribersService: ProcessSummaryNotificationSubscribersService,
    ) {}

    @Public()
    @Get()
    @Redirect()
    async unsubscribe(@Query('token') token: string) {
        if (!token) {
            return { url: `${process.env.RUNBOTICS_ENTRYPOINT_URL}/ui/unsubscribed?status=missing_token` };
        }

        const unsubscribeToken = await this.unsubscribeTokenService.findByToken(token);
        if (!unsubscribeToken) {
            return { url: `${process.env.RUNBOTICS_ENTRYPOINT_URL}/ui/unsubscribed?status=invalid_token` };
        }

        try {
            await this.subscribersService.unsubscribeAllByEmail(unsubscribeToken.email);
            await this.unsubscribeTokenService.deleteByEmail(unsubscribeToken.email);
            return { url: `${process.env.RUNBOTICS_ENTRYPOINT_URL}/ui/unsubscribed?status=success` };
        } catch (error) {
            this.logger.error('Unsubscribe error:', error);
            return { url: `${process.env.RUNBOTICS_ENTRYPOINT_URL}/ui/unsubscribed?status=error` };
        }
    }

}
