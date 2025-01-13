import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, Validate } from 'class-validator';
import { IsMobilePhoneConstraint } from 'src/modules/shared/utils/validators/validate-phone.validator';

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
