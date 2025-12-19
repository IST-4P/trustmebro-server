import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { WebSocketService } from '@common/websocket/websocket.service';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { NotificationModule } from './modules/notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.ROLE_SERVICE),
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
    PrismaModule,
    KafkaModule.register(QueueService.NOTIFICATION_SERVICE),
    NotificationModule,
  ],
  providers: [WebSocketService],
  exports: [WebSocketService],
})
export class AppModule {}
