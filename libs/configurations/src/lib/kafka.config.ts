import { QueueGroups } from '@common/constants/queue.constant';
import { Transport } from '@nestjs/microservices';
import z from 'zod';

export const KafkaConfigurationSchema = z.object({
  KAFKA_URL: z.string(),
});

const configServer = KafkaConfigurationSchema.safeParse(process.env);
if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const KafkaConfiguration = configServer.data;

export const KafkaServerOptions = (queueGroup: QueueGroups) => {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KafkaConfiguration.KAFKA_URL],
      },
      consumer: {
        groupId: queueGroup,
        allowAutoTopicCreation: true,
      },
    },
  };
};
