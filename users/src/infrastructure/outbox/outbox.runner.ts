/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { OutboxWorker } from './outbox.worker';

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

  @Cron('*/0 * * * * *')
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
