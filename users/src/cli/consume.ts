import { DataSource } from 'typeorm';
import { InboxWorker } from '../infrastructure/inbox/inbox.worker';
import { dataSourceOptions } from 'src/infrastructure/database/data-source/data-source';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const worker = new InboxWorker(dataSource);
  await worker.run();
}

void bootstrap();
