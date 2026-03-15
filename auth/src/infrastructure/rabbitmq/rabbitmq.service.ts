/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry() {
    const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

    while (true) {
      try {
        console.log('Connecting to RabbitMQ...');

        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();

        await this.channel.assertExchange('linkedin_exchange', 'topic', {
          durable: true,
        });

        console.log('✅ RabbitMQ connected');
        break;
      } catch (error) {
        console.log('❌ RabbitMQ connection failed. Retrying in 5s...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async getChannel(): Promise<amqp.Channel> {
    while (!this.channel) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return this.channel;
  }
}
