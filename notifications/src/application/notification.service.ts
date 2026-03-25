import { Injectable } from '@nestjs/common';
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

  async createNotification(
    senderId: string,
    receiverId: string,
    message: string,
    type: NotificationType,
    senderName?: string,
    senderAvatar?: string,
  ): Promise<Notification> {
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

    // 🔥 send realtime notification
    this.notificationGateway.sendNotification(receiverId, savedNotification);

    // 🔥 update unread count
    const unreadCount = await this.getUnreadCount(receiverId);

    this.notificationGateway.sendUnreadCount(receiverId, unreadCount);

    return savedNotification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepo.find({
      where: {
        receiverId: userId,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // GET UNREAD COUNT
  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) return null;

    notification.isRead = true;

    await this.notificationRepo.save(notification);

    const unreadCount = await this.getUnreadCount(notification.receiverId);

    this.notificationGateway.sendUnreadCount(
      notification.receiverId,
      unreadCount,
    );

    return notification;
  }

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

    this.notificationGateway.sendUnreadCount(userId, 0);

    return {
      message: 'All notifications marked as read',
    };
  }
}
