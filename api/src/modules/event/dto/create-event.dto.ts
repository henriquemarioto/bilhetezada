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
} from '../../shared/validators/validate-date.validator';

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
  @IsDateBeforeDate('start_time')
  limit_time_for_ticket_purchase: string;

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

  constructor(
    values: {
      name: string;
      description: string;
      address: string;
      start_time: string;
      end_time: string;
      entrance_limit_time: string;
      limit_time_for_ticket_purchase: string;
      time_zone: string;
      price: number;
    } = undefined,
  ) {
    this.name = values?.name;
    this.description = values?.description;
    this.address = values?.address;
    this.start_time = values?.start_time;
    this.end_time = values?.end_time;
    this.entrance_limit_time = values?.entrance_limit_time;
    this.limit_time_for_ticket_purchase =
      values?.limit_time_for_ticket_purchase;
    this.time_zone = values?.time_zone;
    this.price = values?.price;
  }
}
