import { PaginatedResponseDto } from '@/shared/dtos/paginated-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TicketTypeResponseDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;
}

export class PaginatedTicketTypeResponseDto extends PaginatedResponseDto<TicketTypeResponseDto> {}
