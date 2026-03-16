import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

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

  entities:
    process.env.NODE_ENV === 'production'
      ? [
          'dist/**/*.entity.js',
          'src/infrastructure/outbox/*.entity.js',
          'src/infrastructure/inbox/*.entity.js',
        ]
      : [
          'src/**/*.entity.ts',
          'src/infrastructure/outbox/*.entity.ts',
          'src/infrastructure/inbox/*.entity.ts',
        ],

  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/infrastructure/database/migrations/*.js']
      : ['src/infrastructure/database/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

// entities: [join(__dirname, '/../../**/*.entity.{ts,js}')],

// migrations: [join(__dirname, '/../migrations/*.{ts,js}')],
