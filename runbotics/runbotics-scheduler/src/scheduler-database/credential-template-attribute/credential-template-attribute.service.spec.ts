import { Test, TestingModule } from '@nestjs/testing';
import { CredentialTemplateAttributeService } from './credential-template-attribute.service';

describe('CredentialTemplateAttributeService', () => {
  let service: CredentialTemplateAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialTemplateAttributeService],
    }).compile();

    service = module.get<CredentialTemplateAttributeService>(CredentialTemplateAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
