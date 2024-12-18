import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GoogleOauthGuard } from '../utils/guards/google.guard';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { CurrentUser } from '../utils/current-user-decorator';

@Controller()
export class LoginGoogleCallbackController {
  constructor(private authService: AuthService) {}

  @ApiExcludeEndpoint()
  @UseGuards(GoogleOauthGuard)
  @Get('login/google/callback')
  handle(@CurrentUser() user: RequestUser) {
    return this.authService.login(user);
  }
}
