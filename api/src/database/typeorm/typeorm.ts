import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Event } from './entities/event.entity';
import { Logout } from './entities/logout.entity';
import { Timezone } from './entities/timezone.entity';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: [Customer, Event, Logout, Timezone],
  migrations: ['/src/database/typeorm/migrations/*.ts'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
