import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { EventResponseDto } from './dtos/event-response.dto';
import { UpdateEventDTO } from './dtos/update-event.dto';
import { EventService } from './event.service';
import { CreateEventUseCase } from './use-cases/create-event.use-case';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dtos/paginated-response.dto';
import { Event } from './entities/event.entity';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly createEventUseCase: CreateEventUseCase,
  ) {}

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create-event')
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    await this.createEventUseCase.execute(user.userId, createEventDto);
  }

  @ApiBearerAuth('access_token')
  @ApiResponse({
    description: 'Event data',
    type: EventResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-event')
  async getEvent(
    @Query('id') eventId: string,
    @CurrentUser() user: RequestUser,
  ) {
    const event = await this.eventService.getById(eventId, user.userId);
    return plainToInstance(EventResponseDto, event);
  }

  @ApiBearerAuth('access_token')
  @ApiResponse({
    description: 'Paginated list of customer events',
    type: PaginatedResponseDto<Event>,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-customer-events')
  async getCustomerEvents(
    @CurrentUser() user: RequestUser,
    @Query() paginationDto: PaginationDto,
  ) {
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
  @Patch('update-event')
  async updateEvent(
    @Query('id') eventId: string,
    @Body() updateEventDto: UpdateEventDTO,
    @CurrentUser() user: RequestUser,
  ) {
    await this.eventService.update(user.userId, eventId, updateEventDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-event')
  async deleteEvent(
    @Query('id') eventId: string,
    @CurrentUser() user: RequestUser,
  ) {
    await this.eventService.disable(user.userId, eventId);
  }
}
