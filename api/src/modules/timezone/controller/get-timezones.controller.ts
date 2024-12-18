import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/utils/guards/jwt.guard';
import { TimezoneDto } from '../dto/timezone.dto';
import TimezoneService from '../timezone.service';

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
