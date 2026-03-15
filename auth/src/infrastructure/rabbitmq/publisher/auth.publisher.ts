/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';

@Injectable()
export class AuthPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publish(eventType: string, payload: any) {
    const channel = await this.rabbitMQService.getChannel();

    channel.publish(
      'linkedin_exchange',
      eventType,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      },
    );
  }
}
