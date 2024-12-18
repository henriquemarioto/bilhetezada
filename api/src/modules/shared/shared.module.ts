import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import CacheService from './services/cache.service';
import CryptoService from './services/crypto.service';
import { SlugService } from './services/slug.service';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    forwardRef(() => CustomerModule),
  ],
  providers: [SlugService, CryptoService, CacheService],
  exports: [SlugService, CryptoService, CacheService],
})
export default class SharedModule {}
