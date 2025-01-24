import OpenPixChargeStatus from '@/modules/shared/enums/openpix-charge-status.enum';
import { ApiProperty } from '@nestjs/swagger';

class ChargeDto {
  @ApiProperty({ enum: OpenPixChargeStatus })
  status: OpenPixChargeStatus;

  @ApiProperty()
  customer?: unknown;

  @ApiProperty()
  correlationID: string;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  brCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class PixDto {
  @ApiProperty({ type: 'null' })
  pixQrCode: null;

  @ApiProperty()
  charge: unknown;

  @ApiProperty()
  customer: unknown;

  @ApiProperty()
  payer: unknown;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  value: number;

  @ApiProperty()
  transactionID: string;

  @ApiProperty()
  infoPagador: string;

  @ApiProperty()
  raw: unknown;
}

export class PixWebhookBodyDto {
  @ApiProperty()
  charge: ChargeDto;

  @ApiProperty()
  pix: PixDto;

  @ApiProperty({ type: 'null' })
  pixQrCode: null;
}
