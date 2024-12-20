import { Injectable } from '@nestjs/common';
import { Timezones } from '../enums/timezones.enum';

@Injectable()
export default class TimezoneService {
  getAllTimezones(): string[] {
    return Object.values(Timezones) as string[];
  }

  isValidTimezone(timezone: string): boolean {
    return !!Timezones[timezone];
  }
}
