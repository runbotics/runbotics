import { decrypt } from '#utils/decryptor';

export const getEnvValue = (key: string): string | undefined => {
    const configValue = process.env[key];
    const encKey = process.env['ENC_KEY'];
    return (encKey && configValue) ? decrypt(configValue, encKey) : configValue;
};
