import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from '../event.service';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestUser } from '../../shared/dto/request-user.dto';
import { CurrentUser } from '../../auth/utils/current-user-decorator';

@Controller()
export class DeleteEventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete-event')
  async handle(@Query('id') eventId: string, @CurrentUser() user: RequestUser) {
    await this.eventService.disable(user.userId, eventId);
  }
}
