import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { EventService } from '../event.service';

@Controller()
export class DeleteEventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete-event')
  async handle(@Query('id') eventId: string) {
    await this.eventService.disable(eventId);
  }
}
