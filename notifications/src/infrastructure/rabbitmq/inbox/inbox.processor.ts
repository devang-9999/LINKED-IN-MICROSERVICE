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

    if (!events.length) return;

    console.log(`📥 Processing ${events.length} events...`);

    for (const event of events) {
      const payload = event.payload;

      try {
        let senderId: string | undefined;
        let receiverId: string | undefined;
        let message = '';
        let type: NotificationType | undefined;

        switch (event.eventType) {
          case 'connection.requested':
            senderId = payload.senderId;
            receiverId = payload.receiverId;
            message = `${payload.senderName} sent you a connection request`;
            type = NotificationType.CONNECTION_REQUEST;
            break;
          case 'connection.accepted':
            senderId = payload.senderId;
            receiverId = payload.receiverId;
            message = `${payload.senderName} accepted your connection`;
            type = NotificationType.CONNECTION_ACCEPTED;
            break;
          case 'user.followed':
            // ✅ YOUR ACTUAL PAYLOAD STRUCTURE
            senderId = payload.senderId;
            receiverId = payload.receiverId;
            message = `${payload.senderName || 'Someone'} started following you`;
            type = NotificationType.FOLLOW;
            break;

          default:
            console.log('⚠️ Skipping event:', event.eventType);
            event.processed = true;
            await repo.save(event);
            continue;
        }

        if (!senderId || !receiverId) {
          console.log('❌ Invalid payload:', payload);
          event.processed = true;
          await repo.save(event);
          continue;
        }

        // ❌ NO SOCKET HERE
        await this.notificationService.createNotification(
          senderId,
          receiverId,
          message,
          type,
          payload.senderName,
          payload.senderAvatar,
        );

        event.processed = true;
        await repo.save(event);

        console.log(`⚙️ Processed: ${event.eventType}`);
      } catch (err) {
        console.log(`❌ Failed processing ${event.eventType}:`, err.message);
      }
    }
  }
}
