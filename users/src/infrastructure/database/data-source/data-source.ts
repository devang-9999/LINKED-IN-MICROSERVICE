import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from 'src/domain/profile/entities/user.entity';
import { Education } from 'src/domain/profile/entities/education.entity';
import { Experience } from 'src/domain/profile/entities/experience.entity';
import { Skill } from 'src/domain/profile/entities/skill.entity';
import { UserSkill } from 'src/domain/profile/entities/user-skill.entity';
import { Follow } from 'src/domain/followers/entities/follow.entity';
import { Connection } from 'src/domain/connections/entities/connection.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';
import { InboxEvent } from 'src/infrastructure/inbox/inbox.entity';

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

  entities: [
    User,
    Education,
    Experience,
    Skill,
    UserSkill,
    Follow,
    Connection,
    OutboxEvent,
    InboxEvent,
  ],

  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/infrastructure/database/migrations/*.js']
      : ['src/infrastructure/database/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
