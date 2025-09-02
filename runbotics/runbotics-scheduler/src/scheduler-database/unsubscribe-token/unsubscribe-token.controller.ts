import { Controller, Get, NotFoundException, Query, Redirect } from '@nestjs/common';
import { UnsubscribeTokenService } from './unsubscribe-token.service';
import { ProcessSummaryNotificationSubscribersService } from '../process-summary-notification-subscribers/process-summary-notification-subscribers.service';
import { Public } from '#/auth/guards';


@Controller('api/scheduler/unsubscribe')
export class UnsubscribeTokenController {
    constructor(
        private readonly unsubscribeTokenService: UnsubscribeTokenService,
        private readonly subscribersService: ProcessSummaryNotificationSubscribersService,
    ) {}

    @Public()
    @Get()
    @Redirect()
    async unsubscribe(@Query('token') token: string) {
        let status = 'success';

        if (!token) {
            status = 'missing_token';
        } else {
            const unsubscribeToken = await this.unsubscribeTokenService.findByToken(token);
            if (!unsubscribeToken) {
                status = 'invalid_token';
            } else {
                try {
                    await this.subscribersService.unsubscribeAllByEmail(unsubscribeToken.email);
                    await this.unsubscribeTokenService.deleteByEmail(unsubscribeToken.email);
                } catch {
                    status = 'error';
                }
            }
        }

        const url = new URL(`${process.env.RUNBOTICS_ENTRYPOINT_URL}/ui/unsubscribed`);
        url.searchParams.set('status', status);

        return {
            url: url.toString(),
            statusCode: 302
        };
    }

}