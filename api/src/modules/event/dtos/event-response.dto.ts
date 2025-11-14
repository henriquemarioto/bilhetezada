import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class EventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  end_time: Date;

  @ApiProperty()
  entrance_limit_time?: Date;

  @ApiProperty()
  time_zone: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @Exclude()
  customer: any;
}
