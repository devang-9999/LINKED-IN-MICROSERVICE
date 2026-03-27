/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { RepostsService } from './reposts.service';

@Controller('reposts')
export class RepostsController {
  constructor(private readonly service: RepostsService) {}

  @Post(':postId')
  async create(
    @Param('postId') postId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.createRepost(
        postId,
        req.body,
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Create repost error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to create repost',
      });
    }
  }

  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const data = await this.service.getAllReposts(
        Number(page),
        Number(limit),
        req,
      );

      return res.status(200).json(data);
    } catch (error) {
      console.error('Get reposts error:', error?.response || error.message);

      return res.status(500).json({
        message: 'Failed to fetch reposts',
      });
    }
  }

  @Get('post/:postId')
  async getByPost(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const data = await this.service.getRepostsByPost(
        postId,
        Number(page),
        Number(limit),
        req,
      );

      return res.status(200).json(data);
    } catch (error) {
      console.error(
        'Get reposts by post error:',
        error?.response || error.message,
      );

      return res.status(500).json({
        message: 'Failed to fetch reposts for post',
      });
    }
  }

  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.deleteRepost(postId, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Delete repost error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to delete repost',
      });
    }
  }
}
