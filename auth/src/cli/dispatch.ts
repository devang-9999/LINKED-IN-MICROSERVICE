import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OutboxWorker } from '../infrastructure/outbox/outbox.worker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const worker = app.get(OutboxWorker);

  await worker.processEvents();

  await app.close();
}

void bootstrap();
