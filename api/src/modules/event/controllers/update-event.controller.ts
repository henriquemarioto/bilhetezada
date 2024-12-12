import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { UpdateEventDTO } from '../dto/update-event.dto';
import { EventService } from '../event.service';

@Controller()
export class UpdateEventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('update-event')
  async handle(
    @Query('id') eventId: string,
    @Body() updateEventDto: UpdateEventDTO,
  ) {
    await this.eventService.update(eventId, updateEventDto);
  }
}
