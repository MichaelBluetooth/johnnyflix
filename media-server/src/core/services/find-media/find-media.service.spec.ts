import { Test, TestingModule } from '@nestjs/testing';
import { FindMediaService } from './find-media.service';

describe('FindMediaService', () => {
  let service: FindMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindMediaService],
    }).compile();

    service = module.get<FindMediaService>(FindMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
