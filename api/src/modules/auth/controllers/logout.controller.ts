import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../utils/guards/jwt.guard';

@Controller()
export class LogoutController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    return this.authService.logout(req.headers.authorization);
  }
}
