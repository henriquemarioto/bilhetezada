import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PaginationMetaDto } from '@/shared/dtos/paginated-response.dto';

export class EventResponseDto {
  @ApiProperty({
    description: 'Event ID',
    example: 'uuid-string',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Show do Metallica',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Show incrível de rock',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Event start time',
    example: '2024-12-25T20:00:00.000Z',
  })
  @Expose()
  start_time: Date;

  @ApiProperty({
    description: 'Event end time',
    example: '2024-12-25T23:00:00.000Z',
  })
  @Expose()
  end_time: Date;

  @ApiProperty({
    description: 'Event address',
    example: 'São Paulo',
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Event price',
    example: 50.0,
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: 'Event is active',
    example: true,
  })
  @Expose()
  active: boolean;

  @ApiProperty({
    description: 'Event slug',
    example: 'show-do-metallica',
  })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Event creation date',
    example: '2024-11-17T10:00:00.000Z',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: 'Event update date',
    example: '2024-11-17T10:00:00.000Z',
  })
  @Expose()
  updated_at: Date;

  @Exclude()
  customer: any;

  @Exclude()
  customer_id: string;

  @Exclude()
  orders: any;
}

export class PaginatedEventResponseDto {
  @ApiProperty({
    description: 'Array of events',
    type: EventResponseDto,
    isArray: true,
  })
  data: EventResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
