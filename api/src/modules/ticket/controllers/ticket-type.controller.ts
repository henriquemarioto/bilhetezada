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
import { CreateTicketTypeRequestBodyDto } from '../dtos/create-ticket-type.dto';
import { TicketTypeService } from '../services/ticket-type.service';
import { CreateTicketTypeUseCase } from '../use-cases/create-ticket-type.use-case';
import { PaginatedTicketTypeResponseDto, TicketTypeResponseDto } from '../dtos/paginated-ticket-type-response.dto';

@Controller('events')
export class TicketTypeController {
  constructor(
    private readonly ticketService: TicketTypeService,
    private readonly createTicketTypeUseCase: CreateTicketTypeUseCase,
  ) {}

   @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':eventId/ticket-types')
  async createBatch(
    @Param('eventId') eventId: string,
    @Body() createTicketTypeDto: CreateTicketTypeRequestBodyDto,
  ): Promise<void> {
    await this.createTicketTypeUseCase.execute(eventId, {
      name: createTicketTypeDto.name,
    });
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get(':eventId/ticket-types')
  async getEventBatch(
    @Param('eventId') eventId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedTicketTypeResponseDto> {
    const batches = await this.ticketService.findManyPaginated(
      eventId,
      paginationDto,
    );
    return {
      data: batches.data.map((batch) =>
        plainToInstance(TicketTypeResponseDto, batch),
      ),
      meta: batches.meta,
    };
  }
}
