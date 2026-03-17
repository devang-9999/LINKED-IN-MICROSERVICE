/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox.entity';
import { createRabbitMQConnection } from '../rabbitmq/rabbbitmq.connection';

export class InboxWorker {
  constructor(private dataSource: DataSource) {}

  async run() {
    const { channel, exchange } = await createRabbitMQConnection();

    const queue = process.env.RABBITMQ_AUTH_QUEUE!;

    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, 'user.*');

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      const payload = JSON.parse(msg.content.toString());
      const eventType = msg.fields.routingKey;

      const repo = this.dataSource.getRepository(InboxEvent);

      await repo.save({
        eventType,
        payload,
      });

      channel.ack(msg);

      console.log(`📥 Received: ${eventType}`);
    });
  }
}
