import { createDecipheriv } from 'crypto';

const algorithm = 'aes-128-ecb';

export const decrypt = (encryptedText: string, key: string): string => {
    const decipher = createDecipheriv(algorithm, key, null);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
