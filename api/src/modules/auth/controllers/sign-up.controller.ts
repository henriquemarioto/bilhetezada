import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateCustomerDto } from 'src/modules/customer/dto/create-customer.dto';
import AuthProviders from 'src/modules/shared/enums/auth-providers.enum';
import { AuthService } from '../auth.service';

@Controller()
export class CreateAccountController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    tags: ['Create account'],
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async handle(@Body() createCustomerDto: CreateCustomerDto) {
    await this.authService.register(AuthProviders.LOCAL, createCustomerDto);
  }
}
