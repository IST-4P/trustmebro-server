import { KafkaConfiguration } from '@common/configurations/kafka.config';
import { QueueService } from '@common/constants/queue.constant';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { hostname } from 'os';
import { KafkaService } from './kafka.service';

@Module({})
export class KafkaModule {
  static register(serviceName: QueueService): DynamicModule {
    return {
      module: KafkaModule,
      global: true,
      imports: [
        ClientsModule.register([
          {
            name: serviceName,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: `${serviceName}-${hostname()}`,
                brokers: [KafkaConfiguration.KAFKA_URL],
              },
            },
          },
        ]),
      ],
      providers: [
        {
          provide: KafkaService,
          useFactory: (client) => new KafkaService(client),
          inject: [serviceName],
        },
      ],
      exports: [KafkaService],
    };
  }
}
