/* eslint-disable @typescript-eslint/no-floating-promises */

import dataSource from 'src/infrastructure/database/data-source/data-source';
import { NotificationInboxWorker } from 'src/infrastructure/rabbitmq/consumer';

async function bootstrap() {
  try {
    await dataSource.initialize();
    console.log('✅ DB connected');

    const worker = new NotificationInboxWorker(dataSource);
    await worker.run();

    console.log('🚀 Notification consumer started');
  } catch (err) {
    console.error('❌ Worker failed:', err);
  }
}

bootstrap();
