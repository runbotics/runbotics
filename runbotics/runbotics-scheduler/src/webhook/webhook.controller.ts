import { Body, Controller, Param } from '@nestjs/common';
import { PostWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { WebhookService } from '#/webhook/webhook.service';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';

@Controller('api/scheduler')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
    ) {
    }

    @PostWithTenant('webhook')
    createWebhook(
        @Body() newWebhook: CreateClientRegistrationWebhookDto,
        @Param('tenantId') tenantId: string,
    ): Promise<ClientRegistrationWebhook> {
        return this.webhookService.createWebhookEntry(tenantId, newWebhook);
    }
}
