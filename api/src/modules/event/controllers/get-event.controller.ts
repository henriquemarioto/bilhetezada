import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { EventService } from '../event.service';

@Controller()
export class GetEventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('get-event')
  handle(@Query('id') eventId: string) {
    return this.eventService.getById(eventId);
  }
}
