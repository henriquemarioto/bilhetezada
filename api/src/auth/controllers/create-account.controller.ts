import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateCustomerValidatorDto } from 'src/customer/dto/create-customer-validator.dto';

@Controller('auth')
export class CreateAccountController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createCustomerDto: CreateCustomerValidatorDto) {
    return this.authService.register(createCustomerDto);
  }
}
