import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookAuthorizationType } from 'runbotics-common';
import { EncryptionService } from '#/webhook/encryption.service';

export const parseAuthorization = async (authorization: WebhookAuthorization, service: EncryptionService) => {
    switch (authorization.type) {
        case WebhookAuthorizationType.NONE:
            return {};
        case WebhookAuthorizationType.JWT:
            return {
                Authorization: `Bearer ${authorization.data.token}`,
            };
        case WebhookAuthorizationType.BASIC:
            // eslint-disable-next-line no-case-declarations
            const username = service.decrypt(authorization.data.username);
            // eslint-disable-next-line no-case-declarations
            const password = service.decrypt(authorization.data.password);
            return {
                Authorization: 'Basic ' + btoa(`${username}:${password}`),
            };
    }
};

export const replacePlaceholderImmutable = <T>(
    obj: T,
    placeholder: string,
    newValue: string,
): T => {
    if (Array.isArray(obj)) {
        // Nowa tablica, każdy element przetwarzany rekurencyjnie
        return obj.map((item) =>
            replacePlaceholderImmutable(item, placeholder, newValue),
        ) as T;
    } else if (typeof obj === 'object' && obj !== null) {
        // Nowy obiekt
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            newObj[key] = replacePlaceholderImmutable(value, placeholder, newValue);
        }
        return newObj;
    } else if (obj === placeholder) {
        // Podmiana wartości
        return newValue as unknown as T;
    }
    // Inne wartości (np. liczby, boolean, null) — bez zmian
    return obj;
};
