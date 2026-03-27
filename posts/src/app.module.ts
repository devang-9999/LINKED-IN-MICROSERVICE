import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from './infrastructure/security/jwt.module';

import { Post } from './domain/post/entities/post.entity';
import { Repost } from './domain/repost/entities/repost.entity';
import { PostLike } from './domain/like/entities/post-like.entity';
import { Comment } from './domain/comment/entities/comment.entity';
import { CommentLike } from './domain/comment-like/entities/comment-like.entity';

import { PostService } from './application/post/post.service';
import { RepostService } from './application/repost/repost.service';
import { LikeService } from './application/like/like.service';
import { CommentLikeService } from './application/comment-like/comment-like.service';

import { PostController } from './presentation/post/post.controller';
import { RepostController } from './presentation/repost/repost.controller';
import { LikeController } from './presentation/like/like.controller';
import { CommentController } from './presentation/comment/comment.controller';
import { CommentLikeController } from './presentation/comment-like/comment-like.controller';
import { CommentService } from './application/comments/commet.service';
import { dataSourceOptions } from './infrastructure/database/data-source/data-source';
import { OutboxRunner } from './cli/outbox.runner';
import { OutboxEvent } from './infrastructure/rabbitmq/outbox/outbox.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Post,
      Repost,
      PostLike,
      Comment,
      CommentLike,
      OutboxEvent,
    ]),
    JwtModule,
  ],

  controllers: [
    PostController,
    RepostController,
    LikeController,
    CommentController,
    CommentLikeController,
  ],

  providers: [
    PostService,
    RepostService,
    LikeService,
    CommentService,
    CommentLikeService,
    OutboxRunner,
  ],
})
export class AppModule {}
