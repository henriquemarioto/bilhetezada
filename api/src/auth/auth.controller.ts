import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerValidatorDto } from 'src/customer/dto/create-customer-validator.dto';
import { LocalAuthGuard } from './utils/Guards/local.guard';
import { AuthenticatedGuard } from './utils/Guards/authenticated.guard';
import { GoogleOauthGuard } from './utils/Guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Post('register')
  async register(@Body() createCustomerDto: CreateCustomerValidatorDto) {
    return this.authService.register(createCustomerDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
