import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthConsumer } from '../infrastructure/rabbitmq/consumer/auth.consumer';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const consumer = app.get(AuthConsumer);

  await consumer.onModuleInit();

  console.log('Consumer started...');
}

void bootstrap();
