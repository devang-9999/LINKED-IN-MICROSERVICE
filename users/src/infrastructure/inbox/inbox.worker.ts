/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox.entity';
import { createRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';

export class InboxWorker {
  constructor(private dataSource: DataSource) {}

  async run() {
    const { channel, exchange } = await createRabbitMQConnection();

    const queue = process.env.RABBITMQ_USERS_QUEUE!;

    await channel.assertQueue(queue, { durable: true });

    // bind events
    await channel.bindQueue(queue, exchange, 'auth.user.registered');

    console.log('Consuming events...');

    channel.consume(queue, async (msg) => {
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
