import { IsDocumentConstraint } from '@/core/validators/validate-document.validator';
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

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'The document must contain exactly 11 (CPF) or 14 (CNPJ) numbers.',
  })
  @Validate(IsDocumentConstraint)
  document?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description:
      'Password must be at least 12 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.',
  })
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
}
