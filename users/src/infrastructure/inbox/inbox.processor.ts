/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* inbox.processor.ts */
import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox.entity';
import { User } from 'src/domain/profile/entities/user.entity';

export class InboxProcessor {
  constructor(private dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(InboxEvent);
    const userRepo = this.dataSource.getRepository(User);

    const events = await repo.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
    });

    if (!events.length) {
      console.log('No inbox events to process');
      return;
    }

    for (const event of events) {
      try {
        if (event.eventType === 'auth.user.registered') {
          const { userId } = event.payload;

          const existing = await userRepo.findOne({
            where: { id: userId },
          });

          if (!existing) {
            await userRepo.save({ id: userId });
          }
        }

        event.processed = true;
        await repo.save(event);

        console.log(`⚙️ Processed: ${event.eventType}`);
      } catch (err) {
        console.error(`❌ Failed: ${event.eventType}`, err);
      }
    }
  }
}
