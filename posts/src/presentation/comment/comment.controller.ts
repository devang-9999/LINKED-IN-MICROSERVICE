/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from 'src/application/comments/commet.service';
import { CreateCommentDto } from 'src/application/comments/dto/create-comment.dto';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt.gaurd';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto, @Req() req: any) {
    return this.commentService.create(
      req.user.userId,
      dto.text,
      dto.postId,
      dto.parentCommentId,
    );
  }

  @Get(':postId')
  getComments(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getCommentsByPost(
      postId,
      Number(page),
      Number(limit),
    );
  }

  @Get('replies/:commentId')
  getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.commentService.getReplies(
      commentId,
      Number(page),
      Number(limit),
    );
  }

  @Delete(':commentId')
  delete(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
