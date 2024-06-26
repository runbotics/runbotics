import { Test, TestingModule } from '@nestjs/testing';
import { CredentialCollectionService } from './credential-collection.service';

describe('CredentialCollectionService', () => {
  let service: CredentialCollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialCollectionService],
    }).compile();

    service = module.get<CredentialCollectionService>(CredentialCollectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
