import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from '../utils/guards/google.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class LoginGoogleController {
  @ApiOperation({
    tags: ['SSO Login with google'],
  })
  @UseGuards(GoogleOauthGuard)
  @Get('login/google')
  async handle() {}
}
