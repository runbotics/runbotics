
import { ClientRegistrationWebhook, CreateClientRegistrationWebhookRequest } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';

export const createWebhookEntry = ApiTenantResource.post<ClientRegistrationWebhook, CreateClientRegistrationWebhookRequest>(
    'webhooks/createWebhookEntry',
    '/webhook'
);

export const getWebhooks = ApiTenantResource.get<ClientRegistrationWebhook[]>(
    'webhooks/getWebhooks',
    '/webhook'
);

export const getServiceToken = ApiTenantResource.get<{token: string, serviceTokenExpDate: string }>(
    'webhooks/getServiceToken',
    '/get-token'
);
