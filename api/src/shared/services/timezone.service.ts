import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timezone } from 'src/database/typeorm/entities/timezone.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class TimezoneService {
  constructor(
    @InjectRepository(Timezone)
    private timezoneRepository: Repository<Timezone>,
  ) {}

  async getAllTimezones() {
    return this.timezoneRepository.find();
  }

  async isValidTimezone(timezone: string) {
    const timezones = await this.timezoneRepository.find();
    return timezones.some((timezoneDB) => timezoneDB.name == timezone);
  }
}
