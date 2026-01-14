import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: process.env.DATABASE_TYPE as 'postgres' | 'mysql' | 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    join(__dirname, '../../../**/*.entity.{js,ts}'),
    join(__dirname, './entities/*.entity.{js,ts}'),
  ],
  migrations: [join(__dirname, './migrations/*.{js,ts}')],
  autoLoadEntities: true,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  cli: {
    migrationsDir: join(__dirname, './migrations'),
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
