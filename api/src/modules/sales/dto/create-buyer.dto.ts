import { IsMobilePhoneConstraint } from '@/modules/shared/validators/validate-phone.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';

export class CreateBuyerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+5512912345678',
  })
  @IsNotEmpty()
  @Validate(IsMobilePhoneConstraint)
  phone: string;
}
