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
  IsDateBetweenDates,
  IsDateGreaterThanTodayConstraint,
} from 'src/modules/shared/utils/validators/validate-date.validator';

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

  @ApiProperty()
  @IsISO8601()
  @Validate(IsDateGreaterThanTodayConstraint)
  start_time: string;

  @ApiProperty()
  @IsISO8601()
  @IsDateAfterDate('start_time')
  end_time: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  @IsDateBetweenDates('start_time', 'end_time')
  entrance_limit_time: string;

  @ApiProperty()
  @IsString()
  time_zone: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
