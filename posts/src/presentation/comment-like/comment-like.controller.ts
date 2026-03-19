/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CommentLikeService } from '../../application/comment-like/comment-like.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt.gaurd';
import { CreateCommentLikeDto } from 'src/application/comment-like/dto/comment-like.dto';

@UseGuards(JwtAuthGuard)
@Controller('comment-likes')
export class CommentLikeController {
  constructor(private readonly service: CommentLikeService) {}

  @Post()
  toggleLike(@Body() dto: CreateCommentLikeDto, @Req() req: any) {
    return this.service.toggleLike(req.user.userId, dto.commentId);
  }

  @Get(':commentId')
  getLikes(@Param('commentId') commentId: string, @Req() req: any) {
    return this.service.getCommentLikes(commentId, req.user.userId);
  }
}
