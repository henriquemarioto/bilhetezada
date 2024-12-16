import AuthProviders from 'src/shared/enums/auth-providers.enum';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateCustomerDto } from 'src/modules/customer/dto/create-customer.dto';
import { AuthService } from '../auth.service';
import { ApiOperation } from '@nestjs/swagger';

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
