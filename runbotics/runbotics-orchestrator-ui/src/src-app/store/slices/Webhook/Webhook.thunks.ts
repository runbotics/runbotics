import {
    ClientRegistrationWebhook,
    CreateClientRegistrationWebhookRequest,
} from '#src-app/store/slices/Webhook/Webhook.state';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const createWebhookEntry = ApiTenantResource.post<ClientRegistrationWebhook, CreateClientRegistrationWebhookRequest>(
    'webhooks/createWebhookEntry',
    '/webhook'
);
