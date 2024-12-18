import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timezone } from '../../database/typeorm/entities/timezone.entity';
import CacheService from '../shared/services/cache.service';
import { Repository } from 'typeorm';

@Injectable()
export default class TimezoneService {
  timezoneCacheKey: string;

  constructor(
    @InjectRepository(Timezone)
    private timezoneRepository: Repository<Timezone>,
    private cacheService: CacheService,
  ) {
    this.timezoneCacheKey = 'bilhetezada:timezones';
  }

  async getAllTimezones() {
    const cachedTimezones = await this.cacheService.get(this.timezoneCacheKey);

    if (cachedTimezones) {
      return cachedTimezones as Timezone[];
    }

    const timezones = await this.timezoneRepository.find();

    await this.cacheService.set(this.timezoneCacheKey, timezones, 1200);

    return timezones;
  }

  async isValidTimezone(timezone: string) {
    const timezoneInDatabase = await this.timezoneRepository.findOne({
      where: {
        name: timezone,
      },
    });
    return !!timezoneInDatabase;
  }
}
