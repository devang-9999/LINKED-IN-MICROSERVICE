/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq.service';

@Injectable()
export class AuthConsumer implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    const channel = await this.rabbitMQService.getChannel();

    const queue = 'auth_service_queue';

    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, 'linkedin_exchange', 'user.*');

    channel.consume(queue, (msg) => {
      if (!msg) return;

      const eventType = msg.fields.routingKey;
      const data = JSON.parse(msg.content.toString());

      console.log('Received Event:', eventType, data);

      switch (eventType) {
        case 'user.deleted':
          this.handleUserDeleted(data);
          break;
      }

      channel.ack(msg);
    });
  }

  handleUserDeleted(data: any) {
    console.log('Handle user deletion in auth service:', data);
  }
}
