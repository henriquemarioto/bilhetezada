import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  async generateQRCode(jsonData: Record<string, any>): Promise<string> {
    const jsonString = JSON.stringify(jsonData);
    return QRCode.toDataURL(jsonString);
  }
}
