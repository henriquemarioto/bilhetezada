import { PaginatedResponseDto } from '@/shared/dtos/paginated-response.dto';
import { BatchStatus } from '@/shared/enums/ticket-batch-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BatchResponseDto {
  @ApiProperty({ type: 'string' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  name: string;

  @ApiProperty({ type: 'number' })
  @Expose()
  amount: number;

  @ApiProperty({ type: 'number' })
  @Expose()
  quantity: number;

  @ApiProperty({ type: 'number' })
  @Expose()
  sold: number;

  @ApiProperty({ type: 'string' })
  @Expose()
  start_at: string;

  @ApiProperty({ type: 'string' })
  @Expose()
  end_at: string;

  @ApiProperty({ type: 'string', enum: ['ACTIVE', 'INACTIVE', 'EXHAUSTED'] })
  @Expose()
  status: BatchStatus;
}

export class PaginatedBatchResponseDto extends PaginatedResponseDto<BatchResponseDto> {}
