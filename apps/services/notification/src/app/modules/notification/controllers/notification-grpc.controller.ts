import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
  ReadNotificationRequest,
} from '@common/interfaces/models/notification';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class NotificationGrpcController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod(GrpcServiceName.NOTIFICATION_SERVICE, 'CreateNotification')
  createNotification(data: CreateNotificationRequest) {
    return this.notificationService.create(data);
  }

  @GrpcMethod(GrpcServiceName.NOTIFICATION_SERVICE, 'ReadNotification')
  readNotification(data: ReadNotificationRequest) {
    return this.notificationService.read(data);
  }

  @GrpcMethod(GrpcServiceName.NOTIFICATION_SERVICE, 'DeleteNotification')
  deleteNotification(data: DeleteNotificationRequest) {
    return this.notificationService.delete(data);
  }
}
