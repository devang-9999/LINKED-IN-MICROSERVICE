import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/database/data-source/data-source';
import { AuthModule } from './application/modules/auth.module';
import { OutboxModule } from './infrastructure/outbox/outbox.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxDispatcher } from './cli/dispatch';
import { OutboxWorker } from './infrastructure/outbox/outbox.worker';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    OutboxModule,
  ],
  providers: [OutboxWorker, OutboxDispatcher],
})
export class AppModule {}
