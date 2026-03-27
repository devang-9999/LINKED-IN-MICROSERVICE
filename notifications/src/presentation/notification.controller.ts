/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Req,
  UseGuards,
  Patch,
  Param,
  UnauthorizedException,
  Post,
  Body,
} from '@nestjs/common';

import { NotificationService } from 'src/application/notification.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  private getUserId(req: any): string {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return req.user.userId;
  }

  @Post()
  async createNotification(@Body() body: any) {
    const { senderId, receiverId, message, type, senderName, senderAvatar } =
      body;

    return this.notificationService.createNotification(
      senderId,
      receiverId,
      message,
      type,
      senderName,
      senderAvatar,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.notificationService.getNotifications(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.notificationService.getUnreadCount(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  async markAllAsRead(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.notificationService.markAllAsRead(userId);
  }
}
