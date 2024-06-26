import { Test, TestingModule } from '@nestjs/testing';
import { CredentialTemplateController } from './credential-template.controller';
import { CredentialTemplateService } from './credential-template.service';

describe('CredentialTemplateController', () => {
  let controller: CredentialTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialTemplateController],
      providers: [CredentialTemplateService],
    }).compile();

    controller = module.get<CredentialTemplateController>(CredentialTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
