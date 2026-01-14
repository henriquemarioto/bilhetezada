import {
  IsDateAfterDate,
  IsDateBeforeDate,
  IsDateBetweenDates,
  IsDateGreaterThanTodayConstraint,
} from '@/core/validators/validate-date.validator';
import { BrazilStates } from '@/shared/enums/brazil-states.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';

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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State where the event will take place, only 2 words allowed',
    example: 'SP',
    maxLength: 2,
    minLength: 2,
    enum: BrazilStates,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(BrazilStates)
  @MinLength(2)
  @MaxLength(2)
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({
    description: 'Name of the place where the event will be held',
    example: 'Cool Event Hall',
  })
  @IsOptional()
  @IsString()
  place_name: string;

  @ApiProperty({
    description: 'Event start time in ISO format, must be greater than today',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @Validate(IsDateGreaterThanTodayConstraint)
  start_time: string;

  @ApiProperty({
    description: 'Event end time in ISO format, must be after start_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateAfterDate('start_time')
  end_time: string;

  @ApiPropertyOptional({
    description:
      'Entrance limit time in ISO format, must be between start_time and end_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  @IsDateBetweenDates('start_time', 'end_time')
  entrance_limit_time?: string;

  @ApiProperty({
    description: 'Time zone of the event',
    example: 'America/Sao_Paulo',
  })
  @IsNotEmpty()
  @IsString()
  time_zone: string;

  @ApiProperty({
    example: 150,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100000)
  capacity: number;
}
