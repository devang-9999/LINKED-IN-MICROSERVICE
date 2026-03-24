/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
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

  @Delete('request/:userId')
  @UseGuards(JwtAuthGuard)
  cancelRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.connectionsService.cancelRequest(req.user.userId, userId);
  }
  @Get('requests')
  @UseGuards(JwtAuthGuard)
  getReceived(@Req() req: any) {
    return this.connectionsService.getReceivedRequests(req.user.userId);
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  getSent(@Req() req: any) {
    return this.connectionsService.getSentRequests(req.user.userId);
  }
  @Get('status/:userId')
  @UseGuards(JwtAuthGuard)
  getStatus(@Req() req: any, @Param('userId') userId: string) {
    return this.connectionsService.getConnectionStatus(req.user.userId, userId);
  }
}
