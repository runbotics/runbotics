import { Test, TestingModule } from '@nestjs/testing';
import { AttributeService } from './attribute.service';

describe('AttributeService', () => {
  let service: AttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttributeService],
    }).compile();

    service = module.get<AttributeService>(AttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
