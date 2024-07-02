import { Test } from '@nestjs/testing';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { expect, test } from 'vitest';
import { SecretService } from '../secret/secret.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './attribute.entity';
import { Secret } from '../secret/secret.entity';
import { ConfigService } from '@nestjs/config';
import { ServerConfigService } from '#/config/server-config';

describe('AttributeController', () => {
  let controller: AttributeController;
  let attributeService: AttributeService;
  let secretService: SecretService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Attribute]),
        TypeOrmModule.forRoot({
          type: 'postgres',
          port: 5432,
          host: '127.0.0.1',
          database: 'runbotics',
          entities: [Attribute],
          synchronize: true,
        })
      ],
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
          AttributeService
      ],
  })
      .compile();
    secretService = moduleRef.get<SecretService>(SecretService);
    attributeService = moduleRef.get<AttributeService>(AttributeService);
  });

  test('create new attribute', async () => {
    const expectedResult = [
      {
        id: 1,
        value: 'test',
        credentialId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // const attributeBody: CreateAttributeDto = {
    //   value: 'test',
    //   credentialId: '123',
    // };

    // const request: AuthRequest = { user: { id: 1 } };
    // const result = await controller.create(attributeBody, request);
    expect(expectedResult).toBe(expectedResult);
  });

  // test('should test API with vitest', async () => {
  //   const expectedResult = [];
  //   const result = await controller.findAll();
  //   expect(result).toBe(expectedResult);
  // });

});