import { Test, TestingModule } from '@nestjs/testing';
import { Timezones } from '../../../shared/enums/timezones.enum';
import TimezoneService from './timezone.service';

describe('TimezoneService', () => {
  let timezoneService: TimezoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimezoneService],
    }).compile();

    timezoneService = module.get<TimezoneService>(TimezoneService);
  });

  it('should be defined', () => {
    expect(timezoneService).toBeDefined();
  });

  describe('getAllTimezones', () => {
    it('should return all timezones', () => {
      expect(timezoneService.getAllTimezones()).toEqual(
        Object.values(Timezones),
      );
    });
  });

  describe('isValidTimezone', () => {
    it('should validate if timezone exists', () => {
      expect(
        timezoneService.isValidTimezone(Timezones.AMERICA_SAO_PAULO),
      ).toEqual(true);
    });

    it('should return false if timezone not exists', () => {
      expect(timezoneService.isValidTimezone('invalid')).toEqual(false);
    });
  });
});
