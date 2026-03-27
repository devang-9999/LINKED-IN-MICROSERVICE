import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OutboxWorker } from '../infrastructure/outbox/outbox.worker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('Starting Outbox Dispatch...');

  const worker = app.get(OutboxWorker);

  await worker.run();

  console.log('Outbox Dispatch Completed');

  await app.close();
}

void bootstrap();
