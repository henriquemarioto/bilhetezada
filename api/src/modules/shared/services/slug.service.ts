import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class SlugService {
  slug(text: string) {
    return text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  slugWithUUID(text: string) {
    return this.slug(text) + '-' + randomUUID().slice(0, 4);
  }
}
