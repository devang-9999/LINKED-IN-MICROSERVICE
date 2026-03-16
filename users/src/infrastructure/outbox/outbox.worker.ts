// import { DataSource } from 'typeorm';
// import { OutboxEvent } from './outbox.entity';
// import * as amqp from 'amqplib';

// export class OutboxWorker {
//   constructor(private dataSource: DataSource) {}

//   async start() {
//     const connection = await amqp.connect(process.env.RABBITMQ_URL!);
//     const channel = await connection.createChannel();

//     const exchange = process.env.RABBITMQ_EXCHANGE!;

//     await channel.assertExchange(exchange, 'topic', { durable: true });

//     console.log('Outbox worker started...');

//     setInterval(async () => {
//       await this.dispatchEvents(channel, exchange);
//     }, 5000);
//   }

//   private async dispatchEvents(channel: amqp.Channel, exchange: string) {
//     const repo = this.dataSource.getRepository(OutboxEvent);

//     const events = await repo.find({
//       where: { processed: false },
//       take: 20,
//       order: { createdAt: 'ASC' },
//     });

//     for (const event of events) {
//       channel.publish(
//         exchange,
//         event.eventType,
//         Buffer.from(JSON.stringify(event.payload)),
//         { persistent: true },
//       );

//       event.processed = true;

//       await repo.save(event);

//       console.log(`Event dispatched: ${event.eventType}`);
//     }
//   }
// }
