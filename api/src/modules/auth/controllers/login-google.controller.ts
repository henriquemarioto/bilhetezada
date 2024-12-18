import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from '../utils/guards/google.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from '../dto/login-response.dto';

@Controller()
export class LoginGoogleController {
  @ApiOperation({
    tags: ['SSO Login with google'],
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token after redirection',
    type: LoginResponseDto,
  })
  @UseGuards(GoogleOauthGuard)
  @Get('login/google')
  async handle() {}
}
