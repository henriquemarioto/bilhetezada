import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class CacheService {
  constructor(private cacheManager: Cache) {}

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: unknown, ttl: number) {
    return await this.cacheManager.set(key, value, ttl);
  }
}
