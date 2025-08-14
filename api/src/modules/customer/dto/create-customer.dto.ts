import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Matches,
  Validate,
} from 'class-validator';
import { IsValidDocumentConstraint } from '../../shared/validators/validate-document.validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'The document must contain exactly 11 (CPF) or 14 (CNPJ) numbers.',
  })
  @Validate(IsValidDocumentConstraint)
  document?: string;

  @ApiProperty({
    example: '2000-10-10T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601({ strict: true, strictSeparator: true })
  birth_date?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  @IsOptional()
  picture_url?: string;
}
