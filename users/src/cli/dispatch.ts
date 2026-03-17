import { DataSource } from 'typeorm';
import { OutboxWorker } from '../infrastructure/outbox/outbox.worker';
import { dataSourceOptions } from 'src/infrastructure/database/data-source/data-source';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const worker = new OutboxWorker(dataSource);
  await worker.run();

  process.exit(0);
}

void bootstrap();
