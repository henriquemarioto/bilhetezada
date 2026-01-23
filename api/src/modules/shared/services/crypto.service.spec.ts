import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import CryptoService from './crypto.service';

const mockedSercretKey =
  '15291f67d99ea7bc578c3544dadfbb991e66fa69cb36ff70fe30e798e111ff5f';
const mockedIv = '450991fe4877c69287eee36dd82ad97f';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  let mockedConfigService: jest.Mocked<ConfigService>;
  let cryptoCreateCipherivSpy: jest.SpyInstance;
  let cryptoCreateDecipherivSpy: jest.SpyInstance;
  let bcryptHashSync: jest.SpyInstance;
  let bcryptCompareSync: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'cryptSecretKey') return mockedSercretKey;
              if (key === 'cryptIv') return mockedIv;
            }),
          },
        },
      ],
    }).compile();

    cryptoService = module.get<CryptoService>(CryptoService);
    mockedConfigService = module.get<jest.Mocked<ConfigService>>(ConfigService);
    cryptoCreateCipherivSpy = jest
      .spyOn(crypto, 'createCipheriv')
      .mockImplementation((): any => {
        return {
          update: jest.fn().mockReturnValue(Buffer.from('encryptedData')),
          final: jest.fn().mockReturnValue(Buffer.from('finalData')),
        };
      });
    cryptoCreateDecipherivSpy = jest
      .spyOn(crypto, 'createDecipheriv')
      .mockImplementation((): any => {
        return {
          update: jest.fn().mockReturnValue(Buffer.from('decryptedData')),
          final: jest.fn().mockReturnValue(Buffer.from('finalData')),
        };
      });
    bcryptHashSync = jest
      .spyOn(bcrypt, 'hashSync')
      .mockImplementation((): any => 'encryptedWithSalt');
    bcryptCompareSync = jest
      .spyOn(bcrypt, 'compareSync')
      .mockImplementation((): any => true);
  });

  it('should be defined', () => {
    expect(cryptoService).toBeDefined();
    expect(mockedConfigService).toBeDefined();
    expect(cryptoCreateCipherivSpy).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt, return value and call external functions with correct value', () => {
      const result = cryptoService.encrypt('text to encrypt');

      expect(result).toContain(':');
      expect(cryptoCreateCipherivSpy).toHaveBeenCalledWith(
        'aes-256-ctr',
        Buffer.from(mockedSercretKey, 'hex'),
        Buffer.from(mockedIv, 'hex'),
      );
    });
  });

  describe('decrypt', () => {
    it('should decrypt, return value and call external functions with correct value', () => {
      const result = cryptoService.decrypt('hashed:value');

      expect(result).toBe('decryptedDatafinalData');
      expect(cryptoCreateDecipherivSpy).toHaveBeenCalledWith(
        'aes-256-ctr',
        Buffer.from(mockedSercretKey, 'hex'),
        Buffer.from(mockedIv, 'hex'),
      );
    });
  });

  describe('hashSalt', () => {
    it('should return encrypt data with salt', () => {
      const result = cryptoService.hashSalt('value');

      expect(result).toBe('encryptedWithSalt');
      expect(bcryptHashSync).toHaveBeenCalledWith('value', 12);
    });
  });

  describe('compareHashWithSalt', () => {
    it('should return true for successfuly comparation', () => {
      const result = cryptoService.compareHashWithSalt(
        'value',
        'encryptedValue',
      );

      expect(result).toBe(true);
      expect(bcryptCompareSync).toHaveBeenCalledWith('value', 'encryptedValue');
    });
  });
});
