import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { GetManyNotificationsRequest } from '@common/interfaces/models/notification';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class NotificationGrpcController {
  constructor(private readonly notificationService: NotificationService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyNotifications')
  getManyNotifications(data: GetManyNotificationsRequest) {
    return this.notificationService.list(data);
  }
}
