import { User } from '@/modules/user/entities/user.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
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
import AuthProviders from '../../shared/enums/auth-providers.enum';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './services/auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { CurrentUser } from './utils/current-user-decorator';
import { GoogleOauthGuard } from './utils/guards/google.guard';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { LocalAuthGuard } from './utils/guards/local.guard';
import { ConfirmEmailVerificationTokenUseCase } from './use-cases/confirm-email-verification-token.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly confirmEmailVerificationTokenUseCase: ConfirmEmailVerificationTokenUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.authService.signUp(AuthProviders.LOCAL, createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    const BASE64URL_32B_REGEX = /^[A-Za-z0-9_-]{43}$/;

    if (!BASE64URL_32B_REGEX.test(token)) {
      throw new BadRequestException('Invalid token format');
    }

    await this.confirmEmailVerificationTokenUseCase.execute(token);

    return "Sucessfully confirmed email verification. You can now close this window and login.";
  }

  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          example: 'email@email.com',
        },
        password: {
          type: 'string',
          example: '123456789Ab!',
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
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @ApiExcludeEndpoint()
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
  loginGoogleCallback(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req) {
    const authorization = req.headers.authorization;

    if (!authorization)
      throw new UnauthorizedException('Authorization not granted');

    const [, jwt] = req.headers.authorization.split('Bearer ');

    const result = await this.authService.logout(jwt);

    if (!result) throw new NotFoundException('Token not found.');

    return result;
  }
}
