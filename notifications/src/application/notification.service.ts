import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationGateway } from './notification.gateway';
import { Notification, NotificationType } from 'src/domain/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,

    private notificationGateway: NotificationGateway,
  ) {}

  // 🔥 CREATE NOTIFICATION (called by connections service)
  async createNotification(
    senderId: string,
    receiverId: string,
    message: string,
    type: NotificationType,
    senderName?: string,
    senderAvatar?: string,
  ): Promise<Notification | null> {
    // ✅ prevent self-notifications
    if (senderId === receiverId) return null;

    const notification = this.notificationRepo.create({
      senderId,
      receiverId,
      senderName,
      senderAvatar,
      message,
      type,
      isRead: false,
    });

    const savedNotification = await this.notificationRepo.save(notification);

    // 🔥 REAL-TIME EMIT
    this.notificationGateway.sendNotification(receiverId, savedNotification);

    // 🔥 UPDATE COUNT
    const unreadCount = await this.getUnreadCount(receiverId);

    this.notificationGateway.sendUnreadCount(receiverId, unreadCount);

    return savedNotification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepo.find({
      where: { receiverId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  // 🔥 MARK SINGLE AS READ
  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // already read
    if (notification.isRead) return notification;

    notification.isRead = true;
    const updated = await this.notificationRepo.save(notification);

    // 🔥 update count
    const unreadCount = await this.getUnreadCount(notification.receiverId);

    this.notificationGateway.sendUnreadCount(
      notification.receiverId,
      unreadCount,
    );

    return updated;
  }

  // 🔥 MARK ALL AS READ
  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      {
        receiverId: userId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    // 🔥 instantly update UI
    this.notificationGateway.sendUnreadCount(userId, 0);

    return {
      message: 'All notifications marked as read',
    };
  }

  // 🔥 OPTIONAL (ADVANCED) — DELETE NOTIFICATION
  async deleteNotification(notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationRepo.remove(notification);

    const unreadCount = await this.getUnreadCount(notification.receiverId);

    this.notificationGateway.sendUnreadCount(
      notification.receiverId,
      unreadCount,
    );

    return { message: 'Notification deleted' };
  }
}
