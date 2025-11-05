import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ServerConfigService } from '../config/server-config';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer;
    private readonly ivLength = 16;
    
    constructor(private readonly service: ServerConfigService) {
        this.key = crypto
            .createHash('sha256')
            .update(service.encryptionKey)
            .digest();
    }
    
    encrypt(text: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    decrypt(encryptedText: string): string {
        const [ivHex, encryptedHex] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }
}
