import { DataSource, DataSourceOptions } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Event } from './entities/event.entity';
import { Logout } from './entities/logout.entity';
import { Timezone } from './entities/timezone.entity';
import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.test' });

const testConfig = {
  type: `${process.env.DATABASE_TYPE}`,
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [Customer, Event, Logout, Timezone],
  migrations: ['/src/database/typeorm/migrations/*.ts'],
  autoLoadEntities: true,
  synchronize: true,
};

export default registerAs('typeorm-test', () => testConfig);
export const connectionSourceTest = new DataSource(
  testConfig as DataSourceOptions,
);
