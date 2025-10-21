import { WebhookAuthorizationType } from 'runbotics-common';

export interface WebhookAuthorization {
    id: string;
    type: WebhookAuthorizationType;
    data?: Record<string, any> | null;
}

export interface JwtAuthorizationData {
    token: string;
}

export interface BasicAuthorizationData {
    username: string;
    password: string;
}

export interface CreateWebhookAuthorizationBase {
    type: WebhookAuthorizationType;
    data?: Record<string, any> | null;
}

export interface NoneWebhookAuthorizationType extends CreateWebhookAuthorizationBase {
    type: WebhookAuthorizationType.NONE;
    data?: null;
}
export interface JwtWebhookAuthorizationType extends CreateWebhookAuthorizationBase {
    type: WebhookAuthorizationType.JWT;
    data: JwtAuthorizationData;
}
export interface BasicWebhookAuthorizationType extends CreateWebhookAuthorizationBase {
    type: WebhookAuthorizationType.BASIC;
    data: BasicAuthorizationData;
}

export type CreateWebhookAuthorizationRequest =
    | NoneWebhookAuthorizationType
    | JwtWebhookAuthorizationType
    | BasicWebhookAuthorizationType;

export interface UpdateWebhookAuthorizationRequest {
    type?: WebhookAuthorizationType;
    data?: Record<string, any> | null;
}

export interface WebhookPayload {
    id: string;
    webhookIdPath: string;
    payloadDataPath: string;
}

export interface CreateWebhookPayloadRequest {
    webhookIdPath: string;
    payloadDataPath: string;
}

export interface UpdateWebhookPayloadRequest {
    webhookIdPath?: string;
    payloadDataPath?: string;
}

export interface ClientRegistrationWebhook {
    id: string;
    name: string;
    tenantId: string;
    active: boolean;
    applicationUrl: string;
    authorization: WebhookAuthorization | null;
    clientAuthorization: WebhookAuthorization | null;
    payload: WebhookPayload | null;
    registrationPayload: Record<string, any> | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClientRegistrationWebhookRequest {
    name: string;
    active?: boolean;
    applicationUrl: string;
    clientAuthorization: CreateWebhookAuthorizationRequest;
    payload: CreateWebhookPayloadRequest;
    registrationPayload?: string | null;
}

export interface UpdateClientRegistrationWebhookRequest {
    name?: string;
    tenantId?: string;
    active?: boolean;
    applicationUrl?: string;
    authorization?: UpdateWebhookAuthorizationRequest;
    clientAuthorization?: UpdateWebhookAuthorizationRequest;
    payload?: UpdateWebhookPayloadRequest;
    registrationPayload?: Record<string, any> | null;
}

export interface WebhookProcessTrigger {
    id: string;
    tenantId: string;
    webhookId: string;
    processId: number;
    createdAt: string;
}

export interface CreateWebhookProcessTriggerRequest {
    tenantId: string;
    webhookId: string;
    processId: number;
}

export interface UpdateWebhookProcessTriggerRequest {
    tenantId?: string;
    webhookId?: string;
    processId?: number;
}

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
