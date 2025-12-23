import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { NotificationGateway } from '@common/redis/gateway/notification.gateway';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationController } from './controllers/notification.controller';
import { NotificationReadService } from './services/notification-read.service';
import { NotificationWriteService } from './services/notification-write.service';
import { NotificationSubscriber } from './subscribers/notification.subscriber';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.NOTIFICATION_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationWriteService,
    NotificationReadService,
    NotificationGateway,
    NotificationSubscriber,
  ],
})
export class NotificationModule {}
