import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generateQRCode(data: string | Record<string, any>): Promise<string> {
    const jsonString = typeof data == 'string' ? data : JSON.stringify(data);
    return await QRCode.toDataURL(jsonString);
  }
}
