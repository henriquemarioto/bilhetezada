import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UpdateEventDTO } from '../dto/update-event.dto';
import { EventService } from '../event.service';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';

@Controller()
export class UpdateEventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('update-event')
  async handle(
    @Query('id') eventId: string,
    @Body() updateEventDto: UpdateEventDTO,
    @CurrentUser() user: RequestUser,
  ) {
    await this.eventService.update(user.userId, eventId, updateEventDto);
  }
}
