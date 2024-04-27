import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '#/database/secret/secret.entity';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = 'O3OTmXJpIIyUb3ByT4t65xblgsxfDGQu';

@Injectable()
export class SecretService {
    constructor(
        @InjectRepository(Secret)
        private secretRepository: Repository<Secret>,
    ) {
    }

    static decrypt(secret: Secret) {
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, secret.iv);
        const secretData = decipher.update(secret.data, 'hex', 'utf8') +
                           decipher.final('utf8');

        console.log('secret data:', secretData);

        return secretData;
    }

    static encrypt(data: string, tenantId: number): Secret {
        const keyBuffer = Buffer.from(ENCRYPTION_KEY).length;
        console.log(keyBuffer);
        const iv = crypto.randomBytes(16);
        console.log(iv.length);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv.toString('hex').slice(0, 16));

        const encryptedData = Buffer.from(
            cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
        ).toString('utf-8');

        console.log('encrypted data:', encryptedData);
        const secret = new Secret();
        secret.iv = iv.toString('hex').slice(0, 16);
        secret.tenantId = tenantId;
        secret.data = encryptedData;

        return secret;
    }
}
