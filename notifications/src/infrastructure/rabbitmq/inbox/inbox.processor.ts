/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox.entity';
import { NotificationService } from 'src/application/notification.service';
import { NotificationType } from 'src/domain/notification.entity';

export class NotificationInboxProcessor {
  constructor(
    private dataSource: DataSource,
    private notificationService: NotificationService,
  ) {}

  async run() {
    const repo = this.dataSource.getRepository(InboxEvent);

    const events = await repo.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
      take: 50,
    });

    for (const event of events) {
      const payload = event.payload;

      try {
        switch (event.eventType) {
          case 'connection.requested':
            await this.notificationService.createNotification(
              payload.senderId,
              payload.receiverId,
              `${payload.senderName} sent you a connection request`,
              NotificationType.CONNECTION_REQUEST,
              payload.senderName,
              payload.senderAvatar,
            );
            break;

          // 🔥 CONNECTION ACCEPTED
          case 'connection.accepted':
            await this.notificationService.createNotification(
              payload.senderId,
              payload.receiverId,
              `${payload.senderName} accepted your connection`,
              NotificationType.CONNECTION_ACCEPTED,

              payload.senderName,
              payload.senderAvatar,
            );
            break;

          // 🔥 FOLLOW
          case 'user.followed':
            await this.notificationService.createNotification(
              payload.senderId,
              payload.receiverId,
              `${payload.senderName} started following you`,
              NotificationType.FOLLOW,
              payload.senderName,
              payload.senderAvatar,
            );
            break;
        }

        event.processed = true;
        await repo.save(event);

        console.log(`⚙️ Processed: ${event.eventType}`);
      } catch (err) {
        console.log(`❌ Failed processing ${event.eventType}:`, err.message);
      }
    }
  }
}
