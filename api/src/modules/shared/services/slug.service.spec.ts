import { Test, TestingModule } from '@nestjs/testing';
import { SlugService } from './slug.service';

describe('SlugService', () => {
  let slugService: SlugService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlugService],
    }).compile();

    slugService = module.get<SlugService>(SlugService);
  });

  it('should be defined', () => {
    expect(slugService).toBeDefined();
  });

  describe('slug', () => {
    it('should return a slug', () => {
      expect(slugService.slug('Hello World')).toBe('hello-world');
      expect(slugService.slug('Test   Test  Test')).toBe('test-test-test');
      expect(slugService.slug('Test Test Test')).toBe('test-test-test');
      expect(slugService.slug('Test$1% *&(Test!@$ Test$@!')).toBe(
        'test1-test-test',
      );
    });
  });

  describe('slugWithUUID', () => {
    it('should return a slug with a UUID', () => {
      expect(slugService.slugWithUUID('Hello World')).toMatch(
        /^hello-world-[a-f0-9]{4}$/,
      );
      expect(slugService.slugWithUUID('Test   Test  Test')).toMatch(
        /^test-test-test-[a-f0-9]{4}$/,
      );
      expect(slugService.slugWithUUID('Test Test Test')).toMatch(
        /^test-test-test-[a-f0-9]{4}$/,
      );
      expect(slugService.slugWithUUID('Test$1% *&(Test!@$ Test$@!')).toMatch(
        /^test1-test-test-[a-f0-9]{4}$/,
      );
    });
  });
});
