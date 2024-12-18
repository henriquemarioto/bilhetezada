import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { RequestUser } from '../../shared/dto/request-user.dto';
import { EventService } from '../event.service';
import { plainToInstance } from 'class-transformer';
import { EventResponseDto } from '../dto/event-response.dto';

@Controller()
export class GetCustomerEventsController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @ApiResponse({
    description: 'Array with customer events',
    type: EventResponseDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get-customer-events')
  async handle(@CurrentUser() user: RequestUser) {
    const events = await this.eventService.findMany(user.userId);

    return events.map((event) => plainToInstance(EventResponseDto, event));
  }
}
