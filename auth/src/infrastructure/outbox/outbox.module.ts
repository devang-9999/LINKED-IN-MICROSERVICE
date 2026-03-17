import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from './outbox.entity';
import { OutboxWorker } from './outbox.worker';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxEvent])],
  providers: [OutboxWorker],
  exports: [OutboxWorker],
})
export class OutboxModule {}
