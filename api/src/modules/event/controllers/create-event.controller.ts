import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../event.service';

@Controller()
export class CreateEventController {
  constructor(private readonly eventService: EventService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('create-event')
  async handle(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: RequestUser,
  ) {
    await this.eventService.create(user.userId, createEventDto);
  }
}
