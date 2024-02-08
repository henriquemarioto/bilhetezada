import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from '../utils/guards/google.guard';

@Controller('auth')
export class LoginGoogleController {
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}
}
