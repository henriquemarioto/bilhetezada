import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timezone } from '../../database/typeorm/entities/timezone.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import SharedModule from '../shared/shared.module';
import TimezoneService from './timezone.service';
import { GetTimezonesController } from './controller/get-timezones.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timezone]),
    SharedModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [TimezoneService],
  controllers: [GetTimezonesController],
  exports: [TimezoneService],
})
export class TimezoneModule {}
