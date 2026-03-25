/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Delete,
  Get,
  UnauthorizedException,
} from '@nestjs/common';

import { ConnectionsService } from 'src/application/connections/services/connection.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  private getUserId(req: any): string {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user.userId;
  }

  @UseGuards(JwtAuthGuard)
  @Post('request/:userId')
  sendRequest(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.connectionsService.sendRequest(currentUserId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept/:connectionId')
  accept(@Param('connectionId') connectionId: string) {
    return this.connectionsService.acceptRequest(connectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject/:connectionId')
  reject(@Param('connectionId') connectionId: string) {
    return this.connectionsService.rejectRequest(connectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('request/:userId')
  cancelRequest(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.connectionsService.cancelRequest(currentUserId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('requests')
  getReceived(@Req() req: any) {
    const currentUserId = this.getUserId(req);
    return this.connectionsService.getReceivedRequests(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sent')
  getSent(@Req() req: any) {
    const currentUserId = this.getUserId(req);
    return this.connectionsService.getSentRequests(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:userId')
  getStatus(@Req() req: any, @Param('userId') userId: string) {
    const currentUserId = this.getUserId(req);
    return this.connectionsService.getConnectionStatus(currentUserId, userId);
  }
}
