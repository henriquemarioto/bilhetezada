import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsDateString()
  start_time: string;

  @ApiProperty()
  @IsDateString()
  end_time: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  entrance_limit_time: string;

  @ApiProperty()
  @IsString()
  time_zone: string;

  @ApiProperty()
  @IsNumber()
  price: number;
}
