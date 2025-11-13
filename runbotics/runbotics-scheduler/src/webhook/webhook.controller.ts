import { Body, Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { DeleteWithTenant, GetWithTenant, PostWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { WebhookService } from '#/webhook/webhook.service';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { JwtAuthGuard } from '#/auth/guards';
import { DeleteClientRegistrationWebhookDto, deleteClientRegistrationWebhookDtoSchema } from './dto/client-unregistration-webhook.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

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

    @DeleteWithTenant('webhook/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteWebhook(
        @Param('tenantId') tenantId: string,
        @Param('id') webhookId: string,
        @Body(new ZodValidationPipe(deleteClientRegistrationWebhookDtoSchema)) deleteWebhook: DeleteClientRegistrationWebhookDto,
    ) {
        return await this.webhookService.deleteWebhookEntry(tenantId, webhookId, deleteWebhook);
    }
}
