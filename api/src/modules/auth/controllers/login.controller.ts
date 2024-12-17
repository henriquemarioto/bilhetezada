import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from '../utils/guards/local.guard';
import { AuthService } from '../auth.service';

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
  @ApiOkResponse({
    description: 'JWT token',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handle(@Request() req) {
    return this.authService.login(req.user);
  }
}
