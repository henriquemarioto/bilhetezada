import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  document: string;

  @IsString()
  birth_date: Date;

  @IsEmail()
  email: string;
}
