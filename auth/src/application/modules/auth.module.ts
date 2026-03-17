import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Auth } from 'src/domain/entities/auth.entity';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from 'src/infrastructure/security/jwt.strategy';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';
import { OutboxWorker } from 'src/infrastructure/outbox/outbox.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, OutboxEvent]),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'DEVANG',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OutboxWorker],
  exports: [AuthService],
})
export class AuthModule {}
