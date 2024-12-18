import { PartialType } from '@nestjs/swagger';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  Validate,
} from 'class-validator';
import { IsValidDocumentConstraint } from '../../shared/utils/validators/validateDocument';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'The document must contain exactly 11 (CPF) or 14 (CNPJ) numbers.',
  })
  @Validate(IsValidDocumentConstraint)
  document: string;

  @ApiProperty()
  @IsDateString()
  @IsString()
  birth_date: Date;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  picture_url?: string;
}

export class CreateCustomerPartialDTO extends PartialType(CreateCustomerDto) {}
