import { IsPixKeyConstraint } from '@/core/validators/validate-pix-key.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Validate } from 'class-validator';

export class PixKeyDto {
  @ApiProperty()
  @IsString()
  @Validate(IsPixKeyConstraint)
  pixKey: string;
}
