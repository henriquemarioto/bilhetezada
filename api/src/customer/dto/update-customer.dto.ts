import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateCustomerValidatorDto } from './create-customer-validator.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerValidatorDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  document: string;

  @IsString()
  @IsOptional()
  birth_date: Date;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @IsString()
  @IsOptional()
  picture: string;
}
