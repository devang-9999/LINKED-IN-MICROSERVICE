/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Param, Req, Res, Delete, Get } from '@nestjs/common';

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
    try {
      const response = await this.service.sendRequest(userId, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('CONNECTION ERROR:', error?.response?.data);

      return res.status(error?.response?.status || 400).json({
        message: error?.response?.data?.message || 'Connection request failed',
      });
    }
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
  @Delete('request/:userId')
  async cancelRequest(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.cancelRequest(userId, req.headers);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      return res.status(error?.response?.status || 400).json({
        message: error?.response?.data?.message || 'Cancel failed',
      });
    }
  }

  @Get('status/:userId')
  async getStatus(
    @Param('userId') userId: string,
    @Req() req: any,
    @Res() res: express.Response,
  ) {
    try {
      const response = await this.service.getConnectionStatus(
        userId,
        req.headers,
      );

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      return res.status(400).json({
        message: error?.response?.data?.message || 'Status fetch failed',
      });
    }
  }

  @Get('recieved/requests')
  async getReceived(@Req() req: any, @Res() res: express.Response) {
    try {
      const response = await this.service.getReceivedRequests(req.headers);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      return res.status(error?.response?.status || 400).json({
        message:
          error?.response?.data?.message || 'Failed to fetch received requests',
      });
    }
  }

  @Get('requests/sent')
  async getSent(@Req() req: any, @Res() res: express.Response) {
    try {
      const response = await this.service.getSentRequests(req.headers);

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      return res.status(error?.response?.status || 400).json({
        message:
          error?.response?.data?.message || 'Failed to fetch sent requests',
      });
    }
  }
}
