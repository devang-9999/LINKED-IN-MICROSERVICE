import { DataSource } from 'typeorm';
import { InboxProcessor } from 'src/infrastructure/inbox/inbox.processor';
import { dataSourceOptions } from 'src/infrastructure/database/data-source/data-source';

async function bootstrap() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const processor = new InboxProcessor(dataSource);
  await processor.run();

  process.exit(0);
}

void bootstrap();
