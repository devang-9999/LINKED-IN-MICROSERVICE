// import { DataSource } from 'typeorm';
// import { InboxProcessor } from 'src/infrastructure/inbox/inbox.processor';
// import { dataSourceOptions } from 'src/infrastructure/database/data-source/data-source';

// async function bootstrap() {
//   const dataSource = new DataSource(dataSourceOptions);
//   await dataSource.initialize();

//   const processor = new InboxProcessor(dataSource);
//   await processor.run();

//   process.exit(0);
// }

// void bootstrap();
/* inbox.processor.dispatcher.ts */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InboxProcessor } from 'src/infrastructure/inbox/inbox.processor';
import { DataSource } from 'typeorm';

@Injectable()
export class InboxProcessorDispatcher implements OnModuleInit {
  private readonly logger = new Logger(InboxProcessorDispatcher.name);
  private isRunning = false;

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    this.logger.log('Initial Inbox Processing...');
    await this.safeRun();
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    this.logger.log('Inbox Processor Cron Triggered...');
    await this.safeRun();
  }

  private async safeRun() {
    if (this.isRunning) {
      this.logger.warn('Processor already running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      const processor = new InboxProcessor(this.dataSource);
      await processor.run();
    } catch (err) {
      this.logger.error('Inbox processing failed', err);
    } finally {
      this.isRunning = false;
    }
  }
}
