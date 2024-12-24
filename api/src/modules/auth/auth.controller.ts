import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import AuthProviders from '../shared/enums/auth-providers.enum';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './utils/guards/local.guard';
import { CurrentUser } from './utils/current-user-decorator';
import { RequestUser } from '../shared/dto/request-user.dto';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { GoogleOauthGuard } from './utils/guards/google.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    tags: ['Create account'],
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createCustomerDto: CreateCustomerDto) {
    await this.authService.signUp(AuthProviders.LOCAL, createCustomerDto);
  }

  @ApiOperation({
    tags: ['Login'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'JWT token',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: RequestUser) {
    return this.authService.login(user);
  }

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
  async loginGoogle() {}

  @ApiExcludeEndpoint()
  @UseGuards(GoogleOauthGuard)
  @Get('login/google/callback')
  loginGoogleCallback(@CurrentUser() user: RequestUser) {
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    return this.authService.logout(req.headers.authorization);
  }
}
