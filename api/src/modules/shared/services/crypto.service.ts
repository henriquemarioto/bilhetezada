import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export default class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey: Buffer;

  constructor(configService: ConfigService) {
    this.secretKey = Buffer.from(configService.get<string>('cryptSecretKey') || '', 'hex');
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey as crypto.CipherKey,
      iv as crypto.BinaryLike,
    );

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(hash: string): string {
    const [ivHex, content] = hash.split(':');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey as crypto.CipherKey,
      Buffer.from(ivHex, 'hex') as crypto.BinaryLike,
    );

    let decrypted = decipher.update(content, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  }

  hashSalt(text: string): string {
    return bcrypt.hashSync(text, 12);
  }

  compareHashWithSalt(text: string, hash: string): boolean {
    return bcrypt.compareSync(text, hash);
  }
}
