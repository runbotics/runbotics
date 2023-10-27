import { createDecipheriv } from 'crypto';

const algorithm = 'aes-128-cbc';
const iv = '4a8b1eaed8e4ce10';

export const decrypt = (encryptedText: string, key: string): string => {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
