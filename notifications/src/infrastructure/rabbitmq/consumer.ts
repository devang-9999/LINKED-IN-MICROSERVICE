/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox/inbox.entity';
import { createRabbitMQConnection } from './rabbitmq.connection';

export class NotificationInboxWorker {
  private isRunning = false;

  constructor(private dataSource: DataSource) {}

  async run() {
    // جلوگیری duplicate consumers
    if (this.isRunning) {
      console.log('⚠️ Consumer already running...');
      return;
    }

    this.isRunning = true;

    try {
      const { channel, connection, exchange } =
        await createRabbitMQConnection();

      const queue = 'notifications_queue';

      await channel.assertQueue(queue, { durable: true });

      await channel.bindQueue(queue, exchange, 'connection.requested');
      await channel.bindQueue(queue, exchange, 'connection.accepted');
      await channel.bindQueue(queue, exchange, 'user.followed');

      console.log('📥 Notification service consuming events...');

      // 👇 Handle connection close (VERY IMPORTANT)
      connection.on('close', () => {
        console.error('❌ RabbitMQ connection closed');
        this.isRunning = false;
      });

      connection.on('error', (err) => {
        console.error('❌ RabbitMQ connection error:', err);
        this.isRunning = false;
      });

      await channel.consume(queue, async (msg) => {
        if (!msg) return;

        try {
          const payload = JSON.parse(msg.content.toString());
          const eventType = msg.fields.routingKey;

          const repo = this.dataSource.getRepository(InboxEvent);

          await repo.save({
            eventType,
            payload,
            receiverId: payload.receiverId,
            processed: false,
          });

          channel.ack(msg);

          console.log(`📥 Received: ${eventType}`);
        } catch (err) {
          console.error('❌ Message processing failed:', err);

          // ❗ avoid infinite retry loop
          channel.nack(msg, false, false);
        }
      });
    } catch (err) {
      console.error('❌ Consumer startup failed:', err);

      // allow cron to retry
      this.isRunning = false;
    }
  }
}
