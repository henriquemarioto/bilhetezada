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
import { CreateTicketBatchRequestBodyDto } from '../dtos/create-ticket-batch.dto';
import {
  TicketBatchResponseDto,
  PaginatedTicketBatchResponseDto,
} from '../dtos/paginated-batch-response.dto';
import { TicketBatchService } from '../services/ticket-batch.service';
import { CreateTicketBatchUseCase } from '../use-cases/create-ticket-batch.use-case';

@Controller('events')
export class TicketBatchController {
  constructor(
    private readonly batchService: TicketBatchService,
    private readonly createBatchUseCase: CreateTicketBatchUseCase,
  ) {}

   @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':eventId/batches')
  async createBatch(
    @Param('eventId') eventId: string,
    @Body() createBatchDto: CreateTicketBatchRequestBodyDto,
  ): Promise<void> {
    await this.createBatchUseCase.execute(eventId, {
      name: createBatchDto.name,
      amount: createBatchDto.amount,
      ticketQuantity: createBatchDto.ticket_quantity,
      startTime: createBatchDto.start_time,
      endTime: createBatchDto.end_time,
    });
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get(':eventId/batches')
  async getEventBatch(
    @Param('eventId') eventId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedTicketBatchResponseDto> {
    const batches = await this.batchService.findManyPaginated(
      eventId,
      paginationDto,
    );
    return {
      data: batches.data.map((batch) =>
        plainToInstance(TicketBatchResponseDto, batch),
      ),
      meta: batches.meta,
    };
  }
}
