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
    try {
      const response = await this.service.createComment(req.body, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Create comment error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to create comment',
      });
    }
  }

  @Get('comments/:postId')
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.getComments(
        postId,
        Number(page),
        Number(limit),
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Get comments error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch comments',
      });
    }
  }

  @Get('comments/replies/:commentId')
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.getReplies(
        commentId,
        Number(page),
        Number(limit),
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Get replies error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch replies',
      });
    }
  }

  @Delete('comments/:commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.deleteComment(commentId, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Delete comment error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to delete comment',
      });
    }
  }

  @Post('comment-likes')
  async toggleCommentLike(@Req() req: any, @Res() res: express.Response) {
    try {
      const response = await this.service.toggleCommentLike(
        req.body,
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        'Toggle comment like error:',
        error?.response || error.message,
      );

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to toggle comment like',
      });
    }
  }

  @Get('comment-likes/:commentId')
  async getCommentLikes(
    @Param('commentId') commentId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.getCommentLikes(
        commentId,
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error(
        'Get comment likes error:',
        error?.response || error.message,
      );

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch comment likes',
      });
    }
  }
}
