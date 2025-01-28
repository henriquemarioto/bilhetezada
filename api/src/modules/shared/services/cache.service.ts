import { Cache } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class CacheService {
  constructor(private cacheManager: Cache) {}

  async get(key: string): Promise<unknown | null | undefined> {
    try {
      return await this.cacheManager.get(key);
    } catch (error) {
      console.error(error);
    }
  }

  async set(
    key: string,
    value: unknown,
    ttl: number,
  ): Promise<true | undefined> {
    try {
      await this.cacheManager.set(key, value, ttl);
      return true;
    } catch (error) {
      console.error(error);
    }
  }
}
