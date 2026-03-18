/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ConnectionsService } from 'src/application/connections/services/connection.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request/:userId')
  sendRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.connectionsService.sendRequest(req.user.userId, userId);
  }

  @Post('accept/:connectionId')
  accept(@Param('connectionId') connectionId: string) {
    return this.connectionsService.acceptRequest(connectionId);
  }

  @Post('reject/:connectionId')
  reject(@Param('connectionId') connectionId: string) {
    return this.connectionsService.rejectRequest(connectionId);
  }
}
