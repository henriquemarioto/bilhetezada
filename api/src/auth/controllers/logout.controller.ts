import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../utils/guards/authenticated.guard';

@Controller('auth')
export class LogoutController {
  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
