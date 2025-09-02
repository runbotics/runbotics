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
    async unsubscribe(@Query('token') token: string) {
        console.log('Unsubscribe request received with token:', token);
        if (!token) {
            throw new NotFoundException('Token is required');
        }

        const unsubscribeToken = await this.unsubscribeTokenService.findByToken(token);
        if (!unsubscribeToken) {
            throw new NotFoundException('Invalid or expired token');
        }

        await this.subscribersService.unsubscribeAllByEmail(unsubscribeToken.email);
        await this.unsubscribeTokenService.deleteByEmail(unsubscribeToken.email);

        return {
            url: process.env.UNSUBSCRIBE_SUCCESS_URL || 'https://twoja-aplikacja.com/unsubscribed',
            statusCode: 302
        };
    }
}