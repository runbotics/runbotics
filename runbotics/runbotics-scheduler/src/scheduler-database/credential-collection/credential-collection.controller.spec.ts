import { Test, TestingModule } from '@nestjs/testing';
import { CredentialCollectionController } from './credential-collection.controller';
import { CredentialCollectionService } from './credential-collection.service';

describe('CredentialCollectionController', () => {
  let controller: CredentialCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialCollectionController],
      providers: [CredentialCollectionService],
    }).compile();

    controller = module.get<CredentialCollectionController>(CredentialCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
