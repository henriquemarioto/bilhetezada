import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from '../event.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { EventResponseDto } from '../dto/event-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller()
export class GetEventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Event',
    type: EventResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-event')
  async handle(@Query('id') eventId: string) {
    const event = await this.eventService.getById(eventId);
    return plainToInstance(EventResponseDto, event);
  }
}
