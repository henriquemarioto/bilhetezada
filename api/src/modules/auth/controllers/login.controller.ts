import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from '../utils/guards/local.guard';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../utils/current-user-decorator';
import { RequestUser } from 'src/modules/shared/dto/request-user.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

@Controller()
export class LoginController {
  constructor(private readonly authService: AuthService) {}
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
  async handle(@CurrentUser() user: RequestUser) {
    return this.authService.login(user);
  }
}
