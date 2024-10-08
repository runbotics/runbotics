import { DecryptedCredential } from 'runbotics-common';

/**
 * Takes array of decrypted credentials and returns mapped credential attributes in expected type.
 *
 * @param credentials Single element array of decrypted credentials matched for specific action
 * @returns Mapped credential attributes to single object with expected type.
 */
export const credentialAttributesMapper = <R = Record<string, any>>(
    credentials: DecryptedCredential[]
): R | undefined => {
    if (!credentials || !credentials.length) return;
    if (credentials.length > 1) {
        throw new Error('More than one credential per action is not allowed');
    }

    const { attributes } = credentials[0];
    if (!attributes.length) {
        throw new Error('Credential must have at least one attribute');
    }

    const mappedCredential = attributes
        .reduce((acc, { name, value }) => {
            acc[name] = value;
            return acc;
        }, {} as R);

    return Object.values(mappedCredential).length
        ? mappedCredential
        : undefined;
};
