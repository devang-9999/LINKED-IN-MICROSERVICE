/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Notification } from 'src/domain/notification.entity';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production' ? '.env.docker' : '.env.development',
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [Notification],

  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/infrastructure/database/migrations/*.js']
      : ['src/infrastructure/database/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
