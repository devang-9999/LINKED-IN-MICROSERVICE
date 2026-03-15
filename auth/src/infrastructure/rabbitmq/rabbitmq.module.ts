import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { AuthPublisher } from './publisher/auth.publisher';
import { AuthConsumer } from './consumer/auth.consumer';

@Module({
  providers: [RabbitMQService, AuthPublisher, AuthConsumer],
  exports: [RabbitMQService, AuthPublisher],
})
export class RabbitMQModule {}
