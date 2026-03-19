/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  Res,
  Query,
} from '@nestjs/common';

import express from 'express';
import { InteractionsService } from './comments.service';

@Controller()
export class InteractionsController {
  constructor(private readonly service: InteractionsService) {}

  @Post('comments')
  async createComment(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.createComment(req.body, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get('comments/:postId')
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getComments(
      postId,
      page,
      limit,
      req.headers,
    );

    return res.status(response.status).json(response.data);
  }

  @Get('comments/replies/:commentId')
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getReplies(
      commentId,
      page,
      limit,
      req.headers,
    );

    return res.status(response.status).json(response.data);
  }

  @Delete('comments/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.deleteComment(commentId, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Post('comment-likes')
  async toggleCommentLike(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.toggleCommentLike(
      req.body,
      req.headers,
    );

    return res.status(response.status).json(response.data);
  }

  @Get('comment-likes/:commentId')
  async getCommentLikes(
    @Param('commentId') commentId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getCommentLikes(commentId, req.headers);

    return res.status(response.status).json(response.data);
  }
}
