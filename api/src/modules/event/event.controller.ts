import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RequestUser } from '../../shared/dtos/request-user.dto';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDTO } from './dtos/update-event.dto';
import { EventService } from './event.service';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dtos/paginated-response.dto';
import {
  EventResponseDto,
  PaginatedEventResponseDto,
} from './dtos/paginated-event-response.dto';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly createEventUseCase: CreateEventUseCase,
  ) {}

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.createEventUseCase.execute(user.userId, createEventDto);
  }

  @ApiBearerAuth('access_token')
  @ApiResponse({
    description: 'Event data',
    type: EventResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getEvent(
    @Param('id') eventId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<EventResponseDto> {
    const event = await this.eventService.getById(eventId, user.userId);
    return plainToInstance(EventResponseDto, event);
  }

  @ApiBearerAuth('access_token')
  @ApiResponse({
    description: 'Paginated list of customer events',
    type: PaginatedEventResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCustomerEvents(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<EventResponseDto>> {
    const events = await this.eventService.findManyPaginated(user.userId, {
      page: paginationDto.page,
      limit: paginationDto.limit,
    });
    return {
      data: events.data.map((event) =>
        plainToInstance(EventResponseDto, event),
      ),
      meta: events.meta,
    };
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  async updateEvent(
    @Query('id') eventId: string,
    @Body() updateEventDto: UpdateEventDTO,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.eventService.update(user.userId, eventId, updateEventDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteEvent(
    @Query('id') eventId: string,
    @CurrentUser() user: RequestUser,
  ): Promise<void> {
    await this.eventService.disable(user.userId, eventId);
  }
}
