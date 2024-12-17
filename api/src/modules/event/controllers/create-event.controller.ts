import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/utils/current-user-decorator';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../event.service';
import { RequestUser } from 'src/shared/dto/request-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

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
