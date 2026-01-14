import {
  IsDateAfterDate,
  IsDateGreaterThanTodayConstraint,
} from '@/core/validators/validate-date.validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class CreateBatchRequestBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  ticket_quantity: number;

  @ApiProperty({
    description: 'Batch start time in ISO format, must be greater than today',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @Validate(IsDateGreaterThanTodayConstraint)
  start_time: string;

  @ApiProperty({
    description: 'Batch end time in ISO format, must be after start_time',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsDateAfterDate('start_time')
  end_time: string;
}

export class CreateBatchDto {
  name: string;
  amount: number;
  ticketQuantity: number;
  startTime: string;
  endTime: string;
}
