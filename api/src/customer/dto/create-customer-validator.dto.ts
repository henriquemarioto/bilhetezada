import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateCustomerValidatorDto {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsString()
  birth_date: Date;

  @IsEmail()
  email: string;

  @IsString()
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
