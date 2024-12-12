import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleOauthGuard } from '../utils/guards/google.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class LoginGoogleCallbackController {
  constructor(private authService: AuthService) {}

  @ApiExcludeEndpoint()
  @UseGuards(GoogleOauthGuard)
  @Get('login/google/callback')
  handle(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
