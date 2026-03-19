import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { LikesController } from './likes/likes.controller';
import { RepostsController } from './reposts/reposts.controller';
import { InteractionsController } from './comments/comments.controller';
import { PostsService } from './posts/posts.service';
import { LikesService } from './likes/likes.service';
import { RepostsService } from './reposts/reposts.service';
import { InteractionsService } from './comments/comments.service';
import { UploadProxyController } from 'src/users/uploads/proxy.controller';

@Module({
  controllers: [
    PostsController,
    LikesController,
    RepostsController,
    InteractionsController,
    UploadProxyController,
  ],
  providers: [PostsService, LikesService, RepostsService, InteractionsService],
})
export class PostsModule {}
