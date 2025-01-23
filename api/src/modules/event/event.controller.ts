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
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { RequestUser } from '../shared/dto/request-user.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { EventResponseDto } from './dto/event-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateEventDTO } from './dto/update-event.dto';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create-event')
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    await this.eventService.create(user.userId, createEventDto);
  }

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Event',
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

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Array with customer events',
    type: EventResponseDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-customer-events')
  async getCustomerEvents(@CurrentUser() user: RequestUser) {
    const events = await this.eventService.findMany(user.userId);
    return events.map((event) => plainToInstance(EventResponseDto, event));
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
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
