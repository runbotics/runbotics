import { decrypt } from '#utils/decryptor';

export const getEnvValue = (key: string): string | undefined => {
    const configValue = process.env[key];
    const fullEncKey = process.argv.find((arg) => arg.startsWith('--enc-key='));
    const encKey = fullEncKey ? fullEncKey.split('=')[1] : '';
    return (encKey && configValue) ? decrypt(configValue, encKey) : configValue;
};
