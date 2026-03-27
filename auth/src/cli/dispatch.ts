import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxWorker } from 'src/infrastructure/outbox/outbox.worker';

@Injectable()
export class OutboxDispatcher implements OnModuleInit {
  private readonly logger = new Logger(OutboxDispatcher.name);
  private isRunning = false;

  constructor(private readonly worker: OutboxWorker) {}

  async onModuleInit() {
    this.logger.log('Initial Outbox Dispatch...');
    await this.safeRun();
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    this.logger.log('Cron Triggered...');
    await this.safeRun();
  }

  private async safeRun() {
    if (this.isRunning) {
      this.logger.warn('Previous job still running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      await this.worker.run();
    } catch (err) {
      this.logger.error('Outbox dispatch failed', err);
    } finally {
      this.isRunning = false;
    }
  }
}
