/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';
import { InboxEvent } from './inbox.entity';
import { Auth } from '../../domain/entities/auth.entity';

export class InboxProcessor {
  constructor(private dataSource: DataSource) {}

  async run() {
    const inboxRepo = this.dataSource.getRepository(InboxEvent);
    const authRepo = this.dataSource.getRepository(Auth);

    const events = await inboxRepo.find({
      where: { processed: false },
      order: { createdAt: 'ASC' },
      take: 50,
    });

    console.log(`📥 Processing ${events.length} inbox events...`);

    for (const event of events) {
      try {
        const payload = event.payload;

        switch (event.eventType) {
          case 'user.deleted':
            await this.handleUserDeleted(authRepo, payload);
            break;

          default:
            console.log(`⚠️ Unknown event: ${event.eventType}`);
        }

        event.processed = true;
        await inboxRepo.save(event);

        console.log(`✅ Processed: ${event.eventType}`);
      } catch (error) {
        console.error(`❌ Failed: ${event.eventType}`, error);
      }
    }
  }

  private async handleUserDeleted(authRepo: any, payload: any) {
    const { userId } = payload;

    console.log('🗑️ Deleting user from auth:', userId);

    await authRepo.delete({ userId });
  }
}
