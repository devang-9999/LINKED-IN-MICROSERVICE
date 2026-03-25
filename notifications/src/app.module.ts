import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // ✅ ADD

import dataSource from './infrastructure/database/data-source/data-source';

import { Notification } from './domain/notification.entity';
import { NotificationController } from './presentation/notification.controller';
import { NotificationService } from './application/notification.service';
import { NotificationGateway } from './application/notification.gateway';

import { JwtStrategy } from './infrastructure/security/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    TypeOrmModule.forFeature([Notification]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DEVANG',
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [NotificationController],

  providers: [NotificationService, NotificationGateway, JwtStrategy],
})
export class AppModule {}
