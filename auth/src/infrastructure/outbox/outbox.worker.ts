/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

import { OutboxEvent } from './outbox.entity';
import { createRabbitMQConnection } from '../rabbitmq/rabbbitmq.connection';

@Injectable()
export class OutboxWorker {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async run() {
    const { channel, exchange } = await createRabbitMQConnection();

    const repo = this.dataSource.getRepository(OutboxEvent);

    const events = await repo.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
    });

    for (const event of events) {
      try {
        channel.publish(
          exchange,
          event.eventType,
          Buffer.from(JSON.stringify(event.payload)),
          { persistent: true },
        );

        event.processed = true;
        await repo.save(event);

        console.log('✅ Dispatched:', event.eventType);
      } catch (err) {
        console.error('❌ Failed:', event.eventType);
      }
    }
  }
}
