import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProcessSummaryNotificationSubscribersService } from './process-summary-notification-subscribers.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import {
    SubscribeDto,
    subscribeProcessNotificationsDto,
} from '#/scheduler-database/process_summary_notification_subscribers/dto/subscribe.dto';
import {
    UpdateSubscriptionDto, updatesubscriptionProcessNotificationsDto,
} from '#/scheduler-database/process_summary_notification_subscribers/dto/update-subscription.dto';

@FeatureKeys(FeatureKey.PROCESS_CONFIGURE_VIEW)
@Controller('api/scheduler/tenants/:tenantId/process-summary-notification-subscribers')
export class ProcessSummaryNotificationSubscribersController {
    constructor(
        private readonly processNotificationSubscribersService: ProcessSummaryNotificationSubscribersService,
    ) {
    }
    
    @Get()
    async getAllSubscribers() {
        return this.processNotificationSubscribersService.getAllSubscribersWithProcesses();
    }
    
    @Get('/base-information')
    async getAllSubscribersBaseInformation() {
        return this.processNotificationSubscribersService.getAllSubscribersBaseInformation();
    }
    
    @Get('by-process/:processId')
    async getSubscribersByProcess(@Param('processId') processId: number) {
        return this.processNotificationSubscribersService.getSubscribersByProcess(processId);
    }
    
    @Post()
    async subscribe(@Body(new ZodValidationPipe(subscribeProcessNotificationsDto)) body: SubscribeDto ) {
        return this.processNotificationSubscribersService.subscribe(body);
    }
    
    @Put(':id')
    async updateSubscription(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updatesubscriptionProcessNotificationsDto)) body: UpdateSubscriptionDto,
    ) {
        return this.processNotificationSubscribersService.updateSubscription(id, body);
    }
    
    @Delete(':id')
    async unsubscribe(@Param('id') id: string) {
        return this.processNotificationSubscribersService.unsubscribe(id);
    }
    
}
