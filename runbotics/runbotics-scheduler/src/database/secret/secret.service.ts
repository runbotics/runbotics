import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from '#/database/secret/secret.entity';
import * as crypto from 'crypto';
import { ServerConfigService } from '#/config/server-config';

const ALGORITHM = 'aes-256-cbc';

@Injectable()
export class SecretService {
    constructor(
        @InjectRepository(Secret)
        private readonly secretRepository: Repository<Secret>,
        public readonly serverConfigService: ServerConfigService,
    ) {
    }
    
    decrypt(secret: Secret) {
        const decipher = crypto.createDecipheriv(ALGORITHM, this.serverConfigService.encryptionKey, secret.iv);
        const secretData = decipher.update(secret.data, 'hex', 'utf8') +
                           decipher.final('utf8');
        
        return secretData;
    }

    encrypt(data: string, tenantId: string): Secret {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, this.serverConfigService.encryptionKey, iv.toString('hex')
            .slice(0, 16));

        const encryptedData = Buffer.from(
            cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
        ).toString('utf-8');

        const secret = new Secret();
        secret.iv = iv.toString('hex').slice(0, 16);
        secret.tenantId = tenantId;
        secret.data = encryptedData;

        return secret;
    }
}
