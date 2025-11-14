import {
    ClientRegistrationWebhook,
    CreateClientRegistrationWebhookRequest,
    UnregisterClientWebhookRequest
} from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';

type UnregisterWebhookBody = { data?: UnregisterClientWebhookRequest };

export const createWebhookEntry = ApiTenantResource.post<ClientRegistrationWebhook, CreateClientRegistrationWebhookRequest>(
    'webhooks/createWebhookEntry',
    '/webhook'
);

export const getWebhooks = ApiTenantResource.get<ClientRegistrationWebhook[]>('webhooks/getWebhooks', '/webhook');

export const getServiceToken = ApiTenantResource.get<{ token: string; serviceTokenExpDate: string }>(
    'webhooks/getServiceToken',
    '/get-token'
);

export const deleteWebhookEntry = ApiTenantResource.delete<void, UnregisterWebhookBody>(
    'webhooks/deleteWebhookEntry',
    (id: string) => `webhook/${id}`
);
