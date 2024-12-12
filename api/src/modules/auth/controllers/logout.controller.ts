import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../utils/guards/local.guard';

@Controller()
export class LogoutController {
  @UseGuards(LocalAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    return req.logout();
  }
}
