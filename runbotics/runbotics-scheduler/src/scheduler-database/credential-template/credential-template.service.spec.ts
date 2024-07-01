import { Test, TestingModule } from '@nestjs/testing';
import { CredentialTemplateService } from './credential-template.service';

describe('CredentialTemplateService', () => {
  let service: CredentialTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialTemplateService],
    }).compile();

    service = module.get<CredentialTemplateService>(CredentialTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
