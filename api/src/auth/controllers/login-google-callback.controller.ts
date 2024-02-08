import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleOauthGuard } from '../utils/guards/google.guard';

@Controller('auth')
export class LoginGoogleCallbackController {
  constructor(private authService: AuthService) {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
