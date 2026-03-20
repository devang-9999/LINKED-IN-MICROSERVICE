/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Post, Get, Param, Req, Res } from '@nestjs/common';
import express from 'express';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly service: LikesService) {}

  @Post()
  async toggleLike(@Req() req: any, @Res() res: express.Response) {
    try {
      const response = await this.service.toggleLike(req.body, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Toggle like error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to toggle like',
      });
    }
  }

  @Get(':postId')
  async getLikes(
    @Param('postId') postId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.getLikes(postId, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Get likes error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch likes',
      });
    }
  }
}
