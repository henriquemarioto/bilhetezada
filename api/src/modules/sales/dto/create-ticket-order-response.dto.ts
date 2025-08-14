import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketOrderResponseDto {
  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  qrcodeImageUrl: string;

  @ApiProperty()
  pixCopyPaste: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  expiresDate: string;
}
