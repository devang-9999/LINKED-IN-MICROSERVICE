/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as amqp from 'amqplib';

export async function createRabbitMQConnection() {
  const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';

  let connection: amqp.Connection;
  let channel: amqp.Channel;

  while (true) {
    try {
      console.log('Connecting to RabbitMQ...');

      connection = await amqp.connect(url);
      channel = await connection.createChannel();

      const exchange = process.env.RABBITMQ_EXCHANGE || 'linkedin_exchange';

      await channel.assertExchange(exchange, 'topic', {
        durable: true,
      });

      console.log('RabbitMQ connected');

      return { connection, channel, exchange };
    } catch (error) {
      console.log('RabbitMQ connection failed. Retrying in 5s...');
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}
