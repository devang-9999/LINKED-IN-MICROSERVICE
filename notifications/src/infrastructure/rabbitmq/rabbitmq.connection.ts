import amqp from 'amqplib';

export async function createRabbitMQConnection() {
  const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
  const exchange = 'linkedin_exchange';

  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'topic', {
    durable: true,
  });

  console.log('🐰 RabbitMQ connected');

  return { connection, channel, exchange };
}
