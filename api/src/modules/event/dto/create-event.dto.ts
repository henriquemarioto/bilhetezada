import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  IsDateAfterDate,
  IsDateBeforeDate,
  IsDateBetweenDates,
  IsDateGreaterThanTodayConstraint,
} from '../../shared/utils/validators/validate-date.validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @Validate(IsDateGreaterThanTodayConstraint)
  start_time: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateAfterDate('start_time')
  end_time: string;

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  @IsDateBetweenDates('start_time', 'end_time')
  entrance_limit_time: string;

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateBeforeDate('end_time')
  limit_time_for_ticket_purchase: string;

  @ApiProperty()
  @IsString()
  time_zone: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
