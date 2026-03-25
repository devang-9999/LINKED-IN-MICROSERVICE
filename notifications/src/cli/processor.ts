/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { NotificationService } from '../application/notification.service';
import { NotificationGateway } from '../application/notification.gateway';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Notification } from 'src/domain/notification.entity';
import dataSource from 'src/infrastructure/database/data-source/data-source';
import { NotificationInboxProcessor } from '../infrastructure/rabbitmq/inbox/inbox.processor';

async function bootstrap() {
  try {
    await dataSource.initialize();
    console.log('✅ DB connected (processor)');

    const notificationRepo: Repository<Notification> =
      dataSource.getRepository(Notification);

    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'DEVANG',
    });

    const gateway = new NotificationGateway(jwtService);
    const notificationService = new NotificationService(
      notificationRepo,
      gateway,
    );

    const processor = new NotificationInboxProcessor(
      dataSource,
      notificationService,
    );

    setInterval(async () => {
      await processor.run();
    }, 3000);

    console.log('🚀 Notification processor started');
  } catch (err) {
    console.error('❌ Processor failed:', err);
  }
}

bootstrap();
