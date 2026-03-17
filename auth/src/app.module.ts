import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/database/data-source/data-source';
import { AuthModule } from './application/modules/auth.module';
import { OutboxModule } from './infrastructure/outbox/outbox.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule, OutboxModule],
})
export class AppModule {}
