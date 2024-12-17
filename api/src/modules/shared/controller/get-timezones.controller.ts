import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/utils/guards/jwt.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import TimezoneService from '../services/timezone.service';
import { TimezoneDto } from '../dto/timezone.dto';

@Controller()
export class GetTimezonesController {
  constructor(private readonly timezoneService: TimezoneService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Array with all supported timezones',
    type: TimezoneDto,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Get('get-timezones')
  async getAllTimezones(): Promise<TimezoneDto[]> {
    return await this.timezoneService.getAllTimezones();
  }
}
