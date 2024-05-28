import { describe, it, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { ServerConfigService } from '#/config/server-config';
import { SecretService } from '#/scheduler-database/secret/secret.service';
import { Secret } from '#/scheduler-database/secret/secret.entity';

const DATA = 'dpa';

describe('Secret', () => {
    let secretService: SecretService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                {
                    provide: ServerConfigService,
                    useValue: {
                        encryptionKey: 'O3OTmXJpIIyUb3ByT4t65xblgsxfDGQu',
                    },
                },
                {
                    provide: getRepositoryToken(Secret),
                    useValue: {
                        save: vi.fn().mockResolvedValue(null),
                        find: vi.fn().mockResolvedValue([null]),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                    },
                },
                SecretService,
            ],
        })
            .compile();
        
        secretService = moduleRef.get(SecretService);
    });

    it('should encrypt the data', async () => {
        const secret = secretService.encrypt(DATA, '1');

        expect(secret.data).not.toBe(DATA);
    });

    it('should decrypt the data', async () => {
        const secret = secretService.encrypt(DATA, '1');
        const decrypted = secretService.decrypt(secret);

        expect(decrypted).toBe(DATA);
    });
});
