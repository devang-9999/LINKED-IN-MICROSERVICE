/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Patch, Param, Req, Res } from '@nestjs/common';

import express from 'express';
import { ProfileService } from './profile.service';
import { createProxyServer } from 'http-proxy';

const proxy = createProxyServer({});

@Controller('users/profile')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get('me')
  async getMyProfile(@Req() req: any, @Res() res: express.Response) {
    const response = await this.service.getMyProfile(req.headers);
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

  @Get('suggestions')
  async getSuggestions(@Req() req: any, @Res() res: express.Response) {
    try {
      // 🔥 REMOVE CACHE HEADERS (CRITICAL FIX)
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
}
