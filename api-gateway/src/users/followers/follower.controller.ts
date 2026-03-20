/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Delete, Get, Param, Req, Res } from '@nestjs/common';

import express from 'express';
import { FollowersService } from './follower.service';

@Controller('users/followers')
export class FollowersController {
  constructor(private readonly service: FollowersService) {}

  @Post(':userId')
  async follow(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.follow(userId, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Delete(':userId')
  async unfollow(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.unfollow(userId, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Get(':userId')
  async getFollowers(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getFollowers(userId, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get('following/:userId')
  async getFollowing(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getFollowing(userId, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Get('status/:userId')
  async getFollowStatus(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getFollowStatus(userId, req.headers);
    return res.status(response.status).json(response.data);
  }
}
