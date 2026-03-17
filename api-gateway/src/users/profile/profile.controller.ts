/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Patch, Param, Body, Req, Res } from '@nestjs/common';

import express from 'express';
import { ProfileService } from './profile.service';

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

  @Patch('')
  async updateProfile(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.updateProfile(body, req.headers);
    console.log(' i got hitted');
    return res.status(response.status).json(response.data);
  }

  @Patch('profile-picture')
  async updateProfilePicture(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.updateProfilePicture(body, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Patch('cover-picture')
  async updateCoverPicture(
    @Body() body: any,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.updateCoverPicture(body, req.headers);

    return res.status(response.status).json(response.data);
  }
}
