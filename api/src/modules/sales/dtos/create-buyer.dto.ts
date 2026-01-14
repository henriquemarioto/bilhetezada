import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsMobilePhoneConstraint } from '@/core/validators/validate-phone.validator';

export class CreateBuyerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+55 12 912345678',
  })
  @IsNotEmpty()
  @Validate(IsMobilePhoneConstraint)
  phone: string;
}
