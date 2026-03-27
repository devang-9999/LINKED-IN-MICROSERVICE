import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { Post } from 'src/domain/post/entities/post.entity';
import { Repost } from 'src/domain/repost/entities/repost.entity';
import { PostLike } from 'src/domain/like/entities/post-like.entity';
import { Comment } from 'src/domain/comment/entities/comment.entity';
import { CommentLike } from 'src/domain/comment-like/entities/comment-like.entity';
import { OutboxEvent } from 'src/infrastructure/rabbitmq/outbox/outbox.entity';

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

  entities: [Post, Repost, PostLike, Comment, CommentLike, OutboxEvent],

  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/infrastructure/database/migrations/*.js']
      : ['src/infrastructure/database/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
