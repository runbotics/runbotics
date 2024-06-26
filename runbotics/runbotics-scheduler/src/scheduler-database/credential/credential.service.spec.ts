import { Test, TestingModule } from '@nestjs/testing';
import { CredentialService } from './credential.service';

describe('CredentialService', () => {
  let service: CredentialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialService],
    }).compile();

    service = module.get<CredentialService>(CredentialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
