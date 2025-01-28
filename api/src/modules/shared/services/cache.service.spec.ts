import { Test, TestingModule } from '@nestjs/testing';
import CacheService from './cache.service';
import { Cache } from '@nestjs/cache-manager';

describe('CacheService', () => {
  let cacheService: CacheService;
  let mockedCacheManager: jest.Mocked<Cache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: Cache,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    mockedCacheManager = module.get<jest.Mocked<Cache>>(Cache);
  });

  it('should be defined', () => {
    expect(cacheService).toBeDefined();
    expect(mockedCacheManager).toBeDefined();
  });

  describe('get', () => {
    it('should return value from cache and call with correct parameters', async () => {
      mockedCacheManager.get.mockResolvedValue({ test: 'test value' });
      const result = await cacheService.get('testKey');

      expect(result).toStrictEqual({ test: 'test value' });
      expect(mockedCacheManager.get).toHaveBeenCalledWith('testKey');
    });

    it('should return undefined if get cache throws error', async () => {
      mockedCacheManager.get.mockImplementation(() => {
        throw new Error();
      });
      const result = await cacheService.get('testKey');

      expect(result).toBeUndefined();
      expect(mockedCacheManager.get).toHaveBeenCalledWith('testKey');
    });
  });

  describe('set', () => {
    it('should return true if set successfuly', async () => {
      mockedCacheManager.set.mockResolvedValue();
      const result = await cacheService.set('testKey', 'value', 60000);

      expect(result).toBe(true);
      expect(mockedCacheManager.set).toHaveBeenLastCalledWith(
        'testKey',
        'value',
        60000,
      );
    });

    it('should return undefined if cache throws error', async () => {
      mockedCacheManager.set.mockImplementation(() => {
        throw new Error();
      });
      const result = await cacheService.set('testKey', 'value', 60000);

      expect(result).toBeUndefined();
      expect(mockedCacheManager.set).toHaveBeenLastCalledWith(
        'testKey',
        'value',
        60000,
      );
    });
  });
});
