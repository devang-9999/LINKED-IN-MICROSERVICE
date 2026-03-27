/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-floating-promises */

// import dataSource from 'src/infrastructure/database/data-source/data-source';
// import { NotificationInboxWorker } from 'src/infrastructure/rabbitmq/consumer';

// async function bootstrap() {
//   try {
//     await dataSource.initialize();
//     console.log('✅ DB connected');

//     const worker = new NotificationInboxWorker(dataSource);
//     await worker.run();

//     console.log('🚀 Notification consumer started');
//   } catch (err) {
//     console.error('❌ Worker failed:', err);
//   }
// }

// bootstrap();

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { NotificationInboxWorker } from 'src/infrastructure/rabbitmq/consumer';

@Injectable()
export class NotificationConsumerService implements OnModuleInit {
  private worker: NotificationInboxWorker;
  private isInitialized = false;

  constructor(private dataSource: DataSource) {
    this.worker = new NotificationInboxWorker(this.dataSource);
  }

  onModuleInit() {
    console.log('🚀 Notification Consumer Initialized (Nest)');
  }

  @Cron('*/0 * * * * *') // every 5 seconds
  async handleCron() {
    if (this.isInitialized) {
      console.log('⚠️ Consumer already running...');
      return;
    }

    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log('✅ DB connected (consumer)');
      }

      await this.worker.run();

      this.isInitialized = true;

      console.log('🚀 Notification Consumer started via cron');
    } catch (err) {
      console.error('❌ Consumer cron error:', err.message);
    }
  }
}
