import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OutboxEvent } from './outbox.entity';
import { AuthPublisher } from '../rabbitmq/publisher/auth.publisher';

@Injectable()
export class OutboxWorker {
  constructor(
    @InjectRepository(OutboxEvent)
    private readonly outboxRepository: Repository<OutboxEvent>,

    private readonly publisher: AuthPublisher,
  ) {}

  async processEvents() {
    const events = await this.outboxRepository.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
    });

    for (const event of events) {
      try {
        await this.publisher.publish(event.eventType, event.payload);

        event.processed = true;
        await this.outboxRepository.save(event);

        console.log('Event dispatched:', event.eventType);
      } catch (error) {
        console.error('Failed to publish event:', error);
      }
    }
  }
}
