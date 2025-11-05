import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GetWithTenant, PostWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { WebhookService } from '#/webhook/webhook.service';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { JwtAuthGuard } from '#/auth/guards';

@Controller('api/scheduler')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
    ) {
    }
    
    @GetWithTenant('webhook')
    async getWebhook(@Param('tenantId') tenantId: string) {
        return this.webhookService.get(tenantId);
    }

    @PostWithTenant('webhook')
    createWebhook(
        @Body() newWebhook: CreateClientRegistrationWebhookDto,
        @Param('tenantId') tenantId: string,
    ): Promise<ClientRegistrationWebhook> {
        return this.webhookService.createWebhookEntry(tenantId, newWebhook);
    }
    
    @Post('webhook')
    @UseGuards(JwtAuthGuard)
    async processWebhook(@Body() body: Record<string,unknown>) {
        return this.webhookService.processWebhook(body);
    }
}
