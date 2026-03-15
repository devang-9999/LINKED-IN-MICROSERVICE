import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './infrastructure/database/data-source/data-source';
import { AuthModule } from './application/modules/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AuthModule],
})
export class AppModule {}
