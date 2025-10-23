import { WebhookAuthorizationType } from 'runbotics-common';

export interface WebhookRegistrationForm {
    name: string;
    applicationUrl: string;
    type: WebhookAuthorizationType;
    data?: unknown | null;
    registrationPayload?: string;
    webhookIdPath: string;
    payloadDataPath: string;
    token: string | null;
    username: string | null;
    password: string | null;
}

export const initialFormState: WebhookRegistrationForm = {
    name: '',
    applicationUrl: '',
    type: WebhookAuthorizationType.NONE,
    registrationPayload: '',
    webhookIdPath: '',
    payloadDataPath: '',
    token: null,
    username: null,
    password: null,
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
