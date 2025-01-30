import { IsMobilePhoneConstraint } from '@/modules/shared/validators/validate-phone.validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Validate } from 'class-validator';

export class CreateBuyerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+5512912345678',
  })
  @Validate(IsMobilePhoneConstraint)
  phone: string | null;
}
