/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */

import dataSource from 'src/infrastructure/database/data-source/data-source';
import { NotificationInboxWorker } from 'src/infrastructure/rabbitmq/consumer';

async function bootstrap() {
  let worker: NotificationInboxWorker | null = null;

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ DB connected');
    }

    worker = new NotificationInboxWorker(dataSource);

    await worker.run();

    console.log('🚀 Notification consumer started');

    const shutdown = async () => {
      console.log('🛑 Graceful shutdown...');

      try {
        await worker?.stop();
        await dataSource.destroy();
        console.log('✅ Shutdown complete');
      } catch (err) {
        console.error('❌ Shutdown error:', err);
      }

      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Worker failed:', err);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    process.exit(1);
  }
}

bootstrap();
