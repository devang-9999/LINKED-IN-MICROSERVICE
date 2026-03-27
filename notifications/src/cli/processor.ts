/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { NotificationInboxProcessor } from 'src/infrastructure/rabbitmq/inbox/inbox.processor';
import { NotificationService } from 'src/application/notification.service';

@Injectable()
export class NotificationProcessorService implements OnModuleInit {
  private processor: NotificationInboxProcessor;

  constructor(
    private dataSource: DataSource,
    private notificationService: NotificationService,
  ) {
    this.processor = new NotificationInboxProcessor(
      this.dataSource,
      this.notificationService,
    );
  }

  onModuleInit() {
    console.log('Notification Processor Initialized (Nest)');
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    try {
      await this.processor.run();
    } catch (err) {
      console.error('❌ Processor cron error:', err.message);
    }
  }
}
