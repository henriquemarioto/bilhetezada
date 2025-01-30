import { Test, TestingModule } from '@nestjs/testing';
import { QRCodeService } from './qrcode.service';
import * as QRCode from 'qrcode';

describe('QRCodeService', () => {
  let qrCodeService: QRCodeService;
  let qrCodeToDataURLSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QRCodeService],
    }).compile();

    qrCodeService = module.get<QRCodeService>(QRCodeService);
    qrCodeToDataURLSpy = jest
      .spyOn(QRCode, 'toDataURL')
      .mockImplementation(() => 'data:image/png;base64,');
  });

  it('should be defined', () => {
    expect(qrCodeService).toBeDefined();
    expect(qrCodeToDataURLSpy).toBeDefined();
  });

  describe('generateQRCode', () => {
    it('should return qrcode as base64 image if send string', async () => {
      expect(await qrCodeService.generateQRCode('data')).toEqual(
        'data:image/png;base64,',
      );
    });

    it('should return qrcode as base64 image if send object', async () => {
      expect(await qrCodeService.generateQRCode({ test: 'test' })).toEqual(
        'data:image/png;base64,',
      );
    });
  });
});
