/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  Res,
} from '@nestjs/common';

import express from 'express';
import { PostsService } from './posts.service';
import { createProxyServer } from 'http-proxy';

const proxy = createProxyServer({});

@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  async getAll(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.getAllPosts(req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getPost(id, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Post()
  createPost(@Req() req: any, @Res() res: express.Response) {
    proxy.web(req, res, {
      target: process.env.POSTS_SERVICE_URL,
      changeOrigin: true,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    req.url = `/posts/${id}`;

    proxy.web(req, res, {
      target: process.env.POSTS_SERVICE_URL,
      changeOrigin: true,
    });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.deletePost(id, req.headers);

    return res.status(response.status).json(response.data);
  }
}
