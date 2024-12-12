import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class CryptoService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey = undefined;
  private readonly iv = undefined;

  constructor(configService: ConfigService) {
    this.secretKey = Buffer.from(
      configService.get('cryptSecretKey') as string,
      'hex',
    );
    this.iv = Buffer.from(configService.get('cryptIv') as string, 'hex');
  }

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.iv,
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${this.iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(hash: string): string {
    const [iv, content] = hash.split(':');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(iv, 'hex'),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(content, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  encryptSalt(text: string) {
    return bcrypt.hashSync(text, 12);
  }

  compareHashWithSalt(text: string, hash: string) {
    return bcrypt.compareSync(text, hash);
  }
}
