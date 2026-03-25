/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox/inbox.entity';
import { createRabbitMQConnection } from './rabbitmq.connection';

export class NotificationInboxWorker {
  constructor(private dataSource: DataSource) {}

  async run() {
    const { channel, exchange } = await createRabbitMQConnection();

    const queue = 'notifications_queue';

    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, 'connection.requested');
    await channel.bindQueue(queue, exchange, 'connection.accepted');
    await channel.bindQueue(queue, exchange, 'user.followed');

    console.log('📥 Notification service consuming events...');

    await channel.consume(queue, async (msg) => {
      if (!msg) return;

      const payload = JSON.parse(msg.content.toString());
      const eventType = msg.fields.routingKey;

      const repo = this.dataSource.getRepository(InboxEvent);

      await repo.save({
        eventType,
        payload,
        processed: false,
      });

      channel.ack(msg);

      console.log(`📥 Received: ${eventType}`);
    });
  }
}
