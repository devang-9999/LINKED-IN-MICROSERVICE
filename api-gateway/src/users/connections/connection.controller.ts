/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Param, Req, Res } from '@nestjs/common';

import express from 'express';
import { ConnectionsService } from './connection.service';

@Controller('users/connections')
export class ConnectionsController {
  constructor(private readonly service: ConnectionsService) {}

  @Post('request/:userId')
  async sendRequest(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.sendRequest(userId, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Post('accept/:connectionId')
  async accept(
    @Param('connectionId') connectionId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.accept(connectionId, req.headers);

    return res.status(response.status).json(response.data);
  }

  @Post('reject/:connectionId')
  async reject(
    @Param('connectionId') connectionId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    const response = await this.service.reject(connectionId, req.headers);

    return res.status(response.status).json(response.data);
  }
}
