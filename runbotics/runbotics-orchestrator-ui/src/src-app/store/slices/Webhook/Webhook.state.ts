import { WebhookAuthorizationType } from 'runbotics-common';

export interface IWebhookAuthorization {
    id?: string;
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

export interface WebhookAuthorization {
    type: WebhookAuthorizationType;
    data?: Record<string, any> | null;
}

export interface NoneWebhookAuthorizationType extends WebhookAuthorization {
    type: WebhookAuthorizationType.NONE;
    data?: null;
}
export interface JwtWebhookAuthorizationType extends WebhookAuthorization {
    type: WebhookAuthorizationType.JWT;
    data: JwtAuthorizationData;
}
export interface BasicWebhookAuthorizationType extends WebhookAuthorization {
    type: WebhookAuthorizationType.BASIC;
    data: BasicAuthorizationData;
}

export type ICreateWebhookAuthorizationRequest =
    | NoneWebhookAuthorizationType
    | JwtWebhookAuthorizationType
    | BasicWebhookAuthorizationType;

export interface IUpdateWebhookAuthorizationRequest {
    type?: WebhookAuthorizationType;
    data?: Record<string, any> | null;
}

export interface IWebhookPayload {
    id?: string;
    webhookIdPath: string;
    payloadDataPath: string;
}

export interface ICreateWebhookPayloadRequest {
    webhookIdPath: string;
    payloadDataPath: string;
}

export interface IUpdateWebhookPayloadRequest {
    webhookIdPath?: string;
    payloadDataPath?: string;
}

export interface IClientRegistrationWebhook {
    id?: string;
    name: string;
    tenantId: string;
    active: boolean;
    applicationUrl: string;
    authorization?: IWebhookAuthorization | null;
    clientAuthorization?: IWebhookAuthorization | null;
    payload?: IWebhookPayload | null;
    registrationPayload?: Record<string, any> | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateClientRegistrationWebhookRequest {
    name: string;
    active?: boolean;
    applicationUrl: string;
    clientAuthorization?: ICreateWebhookAuthorizationRequest;
    payload?: ICreateWebhookPayloadRequest;
    registrationPayload?: string | null;
}

export interface IUpdateClientRegistrationWebhookRequest {
    name?: string;
    tenantId?: string;
    active?: boolean;
    applicationUrl?: string;
    authorization?: IUpdateWebhookAuthorizationRequest;
    clientAuthorization?: IUpdateWebhookAuthorizationRequest;
    payload?: IUpdateWebhookPayloadRequest;
    registrationPayload?: Record<string, any> | null;
}

export interface IWebhookProcessTrigger {
    id?: string;
    tenantId: string;
    webhookId: string;
    processId: number;
    createdAt?: string;
}

export interface ICreateWebhookProcessTriggerRequest {
    tenantId: string;
    webhookId: string;
    processId: number;
}

export interface IUpdateWebhookProcessTriggerRequest {
    tenantId?: string;
    webhookId?: string;
    processId?: number;
}

export interface WebhookState {
    loading: boolean;
    error: string | null;
    search: string;
    isModalOpen: boolean;
    registerWebhook: ICreateClientRegistrationWebhookRequest | null;
    webhooks: IClientRegistrationWebhook[] | null;
    triggers: IWebhookProcessTrigger[] | null;
    tokenExpirationDate: string | null;
}
