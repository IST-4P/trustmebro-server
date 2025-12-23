import { Module } from '@nestjs/common';
import { NotificationConsumerController } from './controllers/notification-consumer.controller';
import { NotificationGrpcController } from './controllers/notification-grpc.controller';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [NotificationConsumerController, NotificationGrpcController],
  providers: [NotificationRepository, NotificationService],
})
export class NotificationModule {}
