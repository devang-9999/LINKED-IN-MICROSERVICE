/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxWorker } from 'src/infrastructure/outbox/outbox.worker';
import { DataSource } from 'typeorm';

@Injectable()
export class OutboxRunner implements OnModuleInit {
  private worker: OutboxWorker;
  private isRunning = false;

  constructor(private dataSource: DataSource) {
    this.worker = new OutboxWorker(this.dataSource);
  }

  onModuleInit() {
    console.log('🚀 Outbox Runner Initialized');
  }

  @Cron('*/5 * * * * *')
  async handleCron() {
    if (this.isRunning) {
      console.log('⚠️ Outbox already running...');
      return;
    }

    this.isRunning = true;

    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
        console.log('✅ DB connected (outbox)');
      }

      await this.worker.run();
    } catch (err) {
      console.error('❌ Outbox error:', err.message);
    } finally {
      this.isRunning = false;
    }
  }
}
