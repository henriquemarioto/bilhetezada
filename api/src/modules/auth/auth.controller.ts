import { User } from '@/modules/user/entities/user.entity';
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
import AuthProviders from '../../shared/enums/auth-providers.enum';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { AuthService } from './services/auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { CurrentUser } from './utils/current-user-decorator';
import { GoogleOauthGuard } from './utils/guards/google.guard';
import { JwtAuthGuard } from './utils/guards/jwt.guard';
import { LocalAuthGuard } from './utils/guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    await this.authService.signUp(AuthProviders.LOCAL, createUserDto);
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
