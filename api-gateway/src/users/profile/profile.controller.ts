/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import express from 'express';
import { ProfileService } from './profile.service';
import { createProxyServer } from 'http-proxy';
import { JwtAuthGuard } from 'src/jwt/jwt.gaurd';

const proxy = createProxyServer({});

@UseGuards(JwtAuthGuard)
@Controller('users/profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('suggestions')
  async getSuggestions(@Req() req: any, @Res() res: express.Response) {
    try {
      const {
        ['if-none-match']: _etag,
        ['if-modified-since']: _modified,
        ...cleanHeaders
      } = req.headers;

      const response = await this.service.getSuggestions(cleanHeaders);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Suggestions error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch suggestions',
      });
    }
  }

  @Get('messaging/users')
  async getMessagingUsers(@Req() req: any, @Res() res: express.Response) {
    try {
      const {
        ['if-none-match']: _etag,
        ['if-modified-since']: _modified,
        host,
        connection,
        ...cleanHeaders
      } = req.headers;

      const response = await this.service.getMessagingUsers(cleanHeaders);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('Messaging users error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch messaging users',
      });
    }
  }
  @Get('me')
  async getMyProfile(@Req() req: any, @Res() res: express.Response) {
    try {
      const {
        ['if-none-match']: _etag,
        ['if-modified-since']: _modified,
        host,
        connection,
        ...cleanHeaders
      } = req.headers;

      const response = await this.service.getMyProfile(cleanHeaders);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('❌ getMyProfile error:', error?.response || error.message);

      return res.status(error?.response?.status || 500).json({
        message: 'Failed to fetch profile',
      });
    }
  }

  @Get('network/overview')
  async getOverview(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.getNetworkOverview(req.headers);
    return res.status(response.status).json(response.data);
  }

  @Get(':id')
  async getPublicProfile(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.getPublicProfile(id, req.headers);
    return res.status(response.status).json(response.data);
  }

  @Patch()
  updateProfile(@Req() req: any, @Res() res: any) {
    req.url = '/profile';

    proxy.web(req, res, {
      target: process.env.USERS_SERVICE_URL,
      changeOrigin: true,
    });
  }
  @Patch('profile-picture')
  updateProfilePicture(@Req() req: any, @Res() res: any) {
    proxy.web(req, res, {
      target: `${process.env.USERS_SERVICE_URL}`,
      changeOrigin: true,
    });
  }

  @Patch('cover-picture')
  updateCoverPicture(@Req() req: any, @Res() res: any) {
    proxy.web(req, res, {
      target: `${process.env.USERS_SERVICE_URL}`,
      changeOrigin: true,
    });
  }
}
