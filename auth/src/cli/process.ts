import dataSource from 'src/infrastructure/database/data-source/data-source';
import { InboxProcessor } from '../infrastructure/inbox/inbox.processor';

async function bootstrap() {
  await dataSource.initialize();

  const processor = new InboxProcessor(dataSource);
  await processor.run();

  process.exit(0);
}

void bootstrap();
