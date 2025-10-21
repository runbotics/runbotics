import { WebhookAuthorizationType } from 'runbotics-common';

import {
    CreateClientRegistrationWebhookRequest,
    CreateWebhookAuthorizationRequest,
} from '#src-app/store/slices/Webhook';

export const initialFormState: CreateClientRegistrationWebhookRequest = {
    name: '',
    applicationUrl: '',
    clientAuthorization: {
        type: WebhookAuthorizationType.NONE,
        data: null,
    },
    registrationPayload: '',
    payload: {
        webhookIdPath: '',
        payloadDataPath: '',
    },
};

export const newClientAuthorization: (newAuthorizationMethod) => CreateWebhookAuthorizationRequest = (
    newAuthorizationMethod
) => {
    switch (newAuthorizationMethod) {
        case WebhookAuthorizationType.NONE:
            return {
                type: WebhookAuthorizationType.NONE,
                data: null,
            };
        case WebhookAuthorizationType.JWT:
            return {
                type: WebhookAuthorizationType.JWT,
                data: {
                    token: '',
                },
            };
        case WebhookAuthorizationType.BASIC:
            return {
                type: WebhookAuthorizationType.BASIC,
                data: {
                    username: '',
                    password: '',
                },
            };
        default:
            return {
                type: WebhookAuthorizationType.NONE,
                data: null,
            };
    }
};
