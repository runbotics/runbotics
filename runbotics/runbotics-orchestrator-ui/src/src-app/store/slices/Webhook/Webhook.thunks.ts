import {
    IClientRegistrationWebhook,
    ICreateClientRegistrationWebhookRequest,
} from '#src-app/store/slices/Webhook/Webhook.state';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const createWebhookEntry = ApiTenantResource.post<IClientRegistrationWebhook, ICreateClientRegistrationWebhookRequest>(
    'webhooks/createWebhookEntry',
    '/webhook'
);
