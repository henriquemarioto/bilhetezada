import { PaginationDto } from '@/shared/dtos/pagination.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { CreateBatchRequestBodyDto } from '../dtos/create-batch.dto';
import {
  BatchResponseDto,
  PaginatedBatchResponseDto,
} from '../dtos/paginated-batch-response.dto';
import { BatchService } from '../services/batch.service';
import { CreateBatchUseCase } from '../use-cases/create-batch.use-case';

@Controller('events')
export class BatchController {
  constructor(
    private readonly batchService: BatchService,
    private readonly createBatchUseCase: CreateBatchUseCase,
  ) {}

   @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':eventId/ticket-types/:ticketTypeId/batches')
  async createBatch(
    @Param('eventId') eventId: string,
    @Param('ticketTypeId') ticketTypeId: string,
    @Body() createBatchDto: CreateBatchRequestBodyDto,
  ): Promise<void> {
    await this.createBatchUseCase.execute(eventId, ticketTypeId, {
      name: createBatchDto.name,
      amount: createBatchDto.amount,
      ticketQuantity: createBatchDto.ticketQuantity,
      startTime: createBatchDto.startTime,
      endTime: createBatchDto.endTime,
    });
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get(':eventId/ticket-types/:ticketTypeId/batches')
  async getEventBatch(
    @Param('eventId') eventId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedBatchResponseDto> {
    const batches = await this.batchService.findManyPaginated(
      eventId,
      paginationDto,
    );
    return {
      data: batches.data.map((batch) =>
        plainToInstance(BatchResponseDto, batch),
      ),
      meta: batches.meta,
    };
  }
}
