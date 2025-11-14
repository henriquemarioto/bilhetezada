import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {
  IsDateAfterDate,
  IsDateBeforeDate,
  IsDateBetweenDates,
  IsDateGreaterThanTodayConstraint,
} from '../../../core/validators/validate-date.validator';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Event start time in ISO format, must be greater than today',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @Validate(IsDateGreaterThanTodayConstraint)
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  start_time: Date;

  @ApiProperty({
    description: 'Event end time in ISO format, must be after start_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateAfterDate('start_time')
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  end_time: Date;

  @ApiPropertyOptional({
    description:
      'Entrance limit time in ISO format, must be between start_time and end_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  @IsDateBetweenDates('start_time', 'end_time')
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  entrance_limit_time: Date | null;

  @ApiPropertyOptional({
    description:
      'Limit time for ticket purchase in ISO format, must be before start_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateBeforeDate('start_time')
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  limit_time_for_ticket_purchase: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  time_zone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Max(10000)
  price: number;
}
