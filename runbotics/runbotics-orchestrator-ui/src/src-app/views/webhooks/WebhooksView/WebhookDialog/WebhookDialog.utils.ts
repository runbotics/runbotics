import { RequestType, WebhookAuthorizationType } from 'runbotics-common';

export interface WebhookRegistrationFormState {
    name: string;
    applicationUrl: string;
    applicationRequestType: RequestType;
    type: WebhookAuthorizationType;
    data?: unknown | null;
    registrationPayload?: string;
    webhookIdPath: string;
    payloadDataPath: string;
    token: string | null;
    username: string | null;
    password: string | null;
}

export const initialFormState: WebhookRegistrationFormState = {
    name: '',
    applicationUrl: '',
    applicationRequestType: RequestType.GET,
    type: WebhookAuthorizationType.NONE,
    registrationPayload: '{ \n"webhookUrl": "{{webhook}}", \n "webhookId": "{{webhookId}}" \n}',
    webhookIdPath: '',
    payloadDataPath: '',
    token: null,
    username: null,
    password: null,
};

export interface WebhookUnregisterFormState {
    applicationUrl: string;
    applicationRequestType: RequestType;
    unregisterPayload?: string | null;
}

export const initialUnregistrationState: WebhookUnregisterFormState = {
    applicationUrl: '',
    applicationRequestType: RequestType.DELETE,
    unregisterPayload: null
};

export const newClientAuthorization = (
    newAuthorizationMethod: WebhookAuthorizationType
) => {
    switch (newAuthorizationMethod) {
        case WebhookAuthorizationType.NONE:
            return {
                type: WebhookAuthorizationType.NONE,
                token: null,
                username: null,
                password: null,
            };
        case WebhookAuthorizationType.JWT:
            return {
                type: WebhookAuthorizationType.JWT,
                token: '',
                username: null,
                password: null,
            };
        case WebhookAuthorizationType.BASIC:
            return {
                type: WebhookAuthorizationType.BASIC,
                token: null,
                username: '',
                password: '',
            };
        default:
            return {
                type: WebhookAuthorizationType.NONE,
                token: null,
                username: null,
                password: null,
            };
    }
};
