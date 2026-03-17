/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as amqp from 'amqplib';

export async function createRabbitMQConnection() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL!);
  const channel = await connection.createChannel();

  const exchange = process.env.RABBITMQ_EXCHANGE!;

  await channel.assertExchange(exchange, 'topic', { durable: true });

  return { connection, channel, exchange };
}
