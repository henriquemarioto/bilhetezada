import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { AuthenticatedGuard } from 'src/modules/auth/utils/guards/authenticated.guard';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../event.service';
import { Customer } from 'src/database/typeorm/entities/customer.entity';

@Controller()
export class CreateEventController {
  @Inject() eventService: EventService;

  constructor() {}

  @UseGuards(AuthenticatedGuard)
  @Post('create-event')
  handle(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: Customer,
  ) {
    return this.eventService.create(user.id, createEventDto);
  }
}
