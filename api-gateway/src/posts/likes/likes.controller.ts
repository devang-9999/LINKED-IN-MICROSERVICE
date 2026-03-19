/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Controller, Post, Get, Param, Req, Res } from '@nestjs/common';
import express from 'express';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly service: LikesService) {}

  @Post()
  async toggleLike(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.toggleLike(req.body, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get(':postId')
  async getLikes(
    @Param('postId') postId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getLikes(postId, req.headers);

    return res.status(response.status).json(response.data);
  }
}
