import { Body, Controller, Param } from '@nestjs/common';
import { ProcessSummaryNotificationSubscribersService } from './process-summary-notification-subscribers.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import {
    SubscribeDto,
    subscribeProcessNotificationsDto,
    SubscribeSwaggerDto,
} from '#/scheduler-database/process_summary_notification_subscribers/dto/subscribe.dto';
import {
    UpdateSubscriptionDto,
    updatesubscriptionProcessNotificationsDto,
    UpdateSubscriptionSwaggerDto,
} from '#/scheduler-database/process_summary_notification_subscribers/dto/update-subscription.dto';
import {
    DeleteWithTenant,
    GetWithTenant,
    PatchWithTenant,
    PostWithTenant,
} from '#/utils/decorators/with-tenant.decorator';

import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Process Summary Notification Subscribers')
@FeatureKeys(FeatureKey.PROCESS_CONFIGURE_VIEW)
@Controller('api/scheduler')
export class ProcessSummaryNotificationSubscribersController {
    constructor(
        private readonly processNotificationSubscribersService: ProcessSummaryNotificationSubscribersService,
    ) {
    }

    @GetWithTenant('process-summary-notification-subscribers')
    @ApiOperation({ summary: 'Get all subscribers with process information' })
    @ApiResponse({ status: 200, description: 'List of all subscribers with processes' })
    async getAllSubscribers() {
        return this.processNotificationSubscribersService.getAllSubscribersWithProcesses();
    }

    @GetWithTenant('process-summary-notification-subscribers/base-information')
    @ApiOperation({ summary: 'Get all subscribers base information (without process details)' })
    @ApiResponse({ status: 200, description: 'List of all subscribers (basic data)' })
    async getAllSubscribersBaseInformation() {
        return this.processNotificationSubscribersService.getAllSubscribersBaseInformation();
    }

    @GetWithTenant('process-summary-notification-subscribers/processes/:processId')
    @ApiOperation({ summary: 'Get all subscribers for a specific process' })
    @ApiParam({ name: 'processId', type: Number, description: 'ID of the process' })
    @ApiResponse({ status: 200, description: 'List of subscribers for given process' })
    async getSubscribersByProcess(@Param('processId') processId: number) {
        return this.processNotificationSubscribersService.getSubscribersByProcess(processId);
    }

    @PostWithTenant('process-summary-notification-subscribers')
    @ApiOperation({ summary: 'Subscribe to process summary notifications' })
    @ApiBody({ type: SubscribeSwaggerDto })
    @ApiResponse({ status: 201, description: 'Subscription created successfully' })
    async subscribe(
        @Body(new ZodValidationPipe(subscribeProcessNotificationsDto)) body: SubscribeDto,
    ) {
        return this.processNotificationSubscribersService.subscribe(body);
    }

    @PatchWithTenant('process-summary-notification-subscribers/:id')
    @ApiOperation({ summary: 'Update an existing subscription' })
    @ApiParam({ name: 'id', type: String, description: 'ID of the subscription to update' })
    @ApiBody({ type: UpdateSubscriptionSwaggerDto })
    @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
    async updateSubscription(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updatesubscriptionProcessNotificationsDto)) body: UpdateSubscriptionDto,
    ) {
        return this.processNotificationSubscribersService.updateSubscription(id, body);
    }

    @DeleteWithTenant('process-summary-notification-subscribers/:id')
    @ApiOperation({ summary: 'Unsubscribe from process summary notifications' })
    @ApiParam({ name: 'id', type: String, description: 'ID of the subscription to delete' })
    @ApiResponse({ status: 200, description: 'Subscription deleted successfully' })
    async unsubscribe(@Param('id') id: string) {
        return this.processNotificationSubscribersService.unsubscribe(id);
    }
}
