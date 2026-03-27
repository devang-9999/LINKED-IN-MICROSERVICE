/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSource } from 'typeorm';
import { OutboxEvent } from './outbox.entity';
import { createRabbitMQConnection } from '../connection';

export class OutboxWorker {
  constructor(private dataSource: DataSource) {}

  async run() {
    const { connection, exchange } = await createRabbitMQConnection();

    const channel = await connection.createConfirmChannel();

    const repo = this.dataSource.getRepository(OutboxEvent);

    const events = await repo.find({
      where: { processed: false },
      take: 50,
      order: { createdAt: 'ASC' },
    });

    if (!events.length) {
      await channel.close();
      await connection.close();
      return;
    }

    console.log(`📤 Dispatching ${events.length} events...`);

    for (const event of events) {
      try {
        await new Promise<void>((resolve, reject) => {
          channel.publish(
            exchange,
            event.eventType,
            Buffer.from(JSON.stringify(event.payload)),
            { persistent: true },
            (err) => {
              if (err) return reject(err);
              resolve();
            },
          );
        });

        event.processed = true;
        await repo.save(event);

        console.log(`✅ Dispatched: ${event.eventType}`);
      } catch (err) {
        console.error(`❌ Failed to publish ${event.eventType}:`, err.message);
      }
    }

    await channel.close();
    await connection.close();
  }
}
