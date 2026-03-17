/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import { OutboxEvent } from './outbox.entity';
import { createRabbitMQConnection } from '../rabbitmq/rabbitmq.connection';

export class OutboxWorker {
  constructor(private dataSource: DataSource) {}

  async run() {
    const { channel, exchange } = await createRabbitMQConnection();

    const repo = this.dataSource.getRepository(OutboxEvent);

    const events = await repo.find({
      where: { processed: false },
      take: 50,
      order: { createdAt: 'ASC' },
    });

    console.log(`Dispatching ${events.length} events...`);

    for (const event of events) {
      channel.publish(
        exchange,
        event.eventType,
        Buffer.from(JSON.stringify(event.payload)),
        { persistent: true },
      );

      event.processed = true;
      await repo.save(event);

      console.log(`✅ Dispatched: ${event.eventType}`);
    }
  }
}
