import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import dataSource from './infrastructure/database/data-source/data-source';
import { ConversationController } from './presentation/conversation.controller';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { Message } from './domain/messaging.entity';
import { Conversation } from './domain/conversation.entity';
import { MessageController } from './presentation/messaging.controller';
import { MessageService } from './application/messaging/messaging.service';
import { MessageGateway } from './application/messaging/messaging.gateway';
import { ConversationService } from './application/conversation/conversation.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    TypeOrmModule.forFeature([Message, Conversation]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DEVANG',
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [MessageController, ConversationController],

  providers: [MessageService, ConversationService, MessageGateway, JwtStrategy],
})
export class AppModule {}
