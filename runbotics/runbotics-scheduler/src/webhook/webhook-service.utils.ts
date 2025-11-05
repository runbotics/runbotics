import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookAuthorizationType } from 'runbotics-common';
import { EncryptionService } from '#/webhook/encryption.service';

export const parseAuthorization = async (authorization: WebhookAuthorization, service: EncryptionService) => {
    switch (authorization.type) {
        case WebhookAuthorizationType.NONE:
            return {};
        case WebhookAuthorizationType.JWT:
            return {
                Authorization: `Bearer ${service.decrypt(authorization.data.token)}`,
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

export function replacePlaceholdersImmutable<T>(
    obj: T,
    replacements: Record<string, string>,
): T {
    if (Array.isArray(obj)) {
        return obj.map((item) =>
            replacePlaceholdersImmutable(item, replacements),
        ) as T;
    }

    if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            newObj[key] = replacePlaceholdersImmutable(value, replacements);
        }
        return newObj;
    }

    if (typeof obj === 'string') {
        let newStr: string = obj;
        for (const [placeholder, newValue] of Object.entries(replacements)) {
            if (newStr.includes(placeholder)) {
                newStr = newStr.split(placeholder).join(newValue);
            }
        }
        return newStr as unknown as T;
    }

    return obj;
}
