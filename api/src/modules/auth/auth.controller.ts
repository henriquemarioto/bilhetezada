import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../customer/dto/create-customer.dto';
import AuthProviders from '../shared/enums/auth-providers.enum';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './utils/guards/local.guard';
import { CurrentUser } from './utils/current-user-decorator';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { GoogleOauthGuard } from './utils/guards/google.guard';
import { Customer } from '@/entities/customer.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createCustomerDto: CreateCustomerDto) {
    await this.authService.signUp(AuthProviders.LOCAL, createCustomerDto);
  }

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
  async login(@CurrentUser() user: Customer) {
    return this.authService.login(user);
  }

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
  loginGoogleCallback(@CurrentUser() user: Customer) {
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    const authorization = req.headers.authorization;

    if (!authorization)
      throw new UnauthorizedException('Authorization not granted');

    const [_, jwt] = req.headers.authorization.split('Bearer ');

    const result = await this.authService.logout(jwt);

    if (!result) throw new NotFoundException('Token not found.');

    return result;
  }
}
