import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';
import { InboxEvent } from 'src/infrastructure/inbox/inbox.entity';
// import { join } from 'path';

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
  // entities: [join(__dirname, '/../../**/*.entity.{ts,js}')],
  entities:
    process.env.NODE_ENV === 'production'
      ? ['dist/**/*.entity.js', OutboxEvent, InboxEvent]
      : ['src/**/*.entity.ts', OutboxEvent, InboxEvent],
  // migrations: [join(__dirname, '/../migrations/*.{ts,js}')],

  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/infrastructure/database/migrations/*.js']
      : ['src/infrastructure/database/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
