import { ClientRegistrationWebhook, CreateClientRegistrationWebhookRequest, WebhookProcessTrigger } from 'runbotics-common';

export interface WebhookState {
    loading: boolean;
    error: string | null;
    search: string;
    isModalOpen: boolean;
    registerWebhook: CreateClientRegistrationWebhookRequest | null;
    webhooks: ClientRegistrationWebhook[] | null;
    triggers: WebhookProcessTrigger[] | null;
    tokenExpirationDate: string | null;
}
