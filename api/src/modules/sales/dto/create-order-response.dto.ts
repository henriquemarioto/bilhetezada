import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponseDto {
  @ApiProperty()
  transactionReference: string;

  @ApiProperty()
  qrcodeImageUrl: string;

  @ApiProperty()
  pixCopyPaste: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  expiresDate: string;
}
