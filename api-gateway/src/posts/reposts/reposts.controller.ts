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
    const response = await this.service.createRepost(
      postId,
      req.body,
      req.headers,
    );

    return res.status(response.status).json(response.data);
  }

  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getAllReposts(page, limit, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get('post/:postId')
  async getByPost(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getRepostsByPost(
      postId,
      page,
      limit,
      req.headers,
    );

    return res.status(response.status).json(response.data);
  }

  @Delete(':postId')
  async delete(
    @Param('postId') postId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.deleteRepost(postId, req.headers);

    return res.status(response.status).json(response.data);
  }
}
