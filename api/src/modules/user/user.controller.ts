import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestUser } from '../../shared/dtos/request-user.dto';
import { CurrentUser } from '../auth/utils/current-user-decorator';
import { JwtAuthGuard } from '../auth/utils/guards/jwt.guard';
import { PixKeyDto } from './dtos/pix-key.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './services/user.service';
import { RegisterUserPixKeyUseCase } from './use-cases/register-use-pix-key.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.user-case';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly registerUserPixKey: RegisterUserPixKeyUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('pix-key')
  async registerPixKey(
    @CurrentUser() user: RequestUser,
    @Body() pixKeyDto: PixKeyDto,
  ) {
    await this.registerUserPixKey.execute(user.userId, pixKeyDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  async update(
    @CurrentUser() user: RequestUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.updateUserUseCase.execute(user.userId, updateUserDto);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@CurrentUser() user: RequestUser) {
    await this.userService.disable(user.userId);
  }
}
