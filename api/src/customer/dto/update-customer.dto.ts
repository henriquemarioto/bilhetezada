import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsString()
  birth_date: Date;

  @IsEmail()
  email: string;
}
