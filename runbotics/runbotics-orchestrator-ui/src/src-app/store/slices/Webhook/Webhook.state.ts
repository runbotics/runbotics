import {
    ClientRegistrationWebhook,
    CreateClientRegistrationWebhookRequest,
    UnregisterClientWebhookRequest,
    WebhookProcessTrigger
} from 'runbotics-common';

export interface WebhookState {
    loading: boolean;
    error: string | null;
    search: string;
    isModalOpen: boolean;
    isUnregisterModalOpen: boolean;
    modalWebhookId: string | null;
    registerWebhook: CreateClientRegistrationWebhookRequest | null;
    unregisterWebhook: UnregisterClientWebhookRequest | null;
    webhooks: ClientRegistrationWebhook[] | null;
    triggers: WebhookProcessTrigger[] | null;
    tokenExpirationDate: string | null;
}
