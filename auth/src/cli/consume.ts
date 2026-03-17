import dataSource from 'src/infrastructure/database/data-source/data-source';
import { OutboxWorker } from '../infrastructure/outbox/outbox.worker';

async function bootstrap() {
  await dataSource.initialize();

  const worker = new OutboxWorker(dataSource);
  await worker.run();

  process.exit(0);
}

void bootstrap();
