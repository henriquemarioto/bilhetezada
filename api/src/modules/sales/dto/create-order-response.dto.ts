import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderResponseDto {
  @ApiProperty()
  pixQRCodeBase64: string;

  @ApiProperty()
  pixCopyPaste: string;
}
