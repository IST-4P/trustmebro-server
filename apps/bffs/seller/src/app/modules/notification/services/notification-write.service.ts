import {
  DeleteNotificationRequest,
  NOTIFICATION_SERVICE_NAME,
  NOTIFICATION_SERVICE_PACKAGE_NAME,
  NotificationResponse,
  NotificationServiceClient,
  ReadNotificationRequest,
} from '@common/interfaces/proto-types/notification';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationWriteService implements OnModuleInit {
  private notificationService!: NotificationServiceClient;

  constructor(
    @Inject(NOTIFICATION_SERVICE_PACKAGE_NAME)
    private notificationClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationClient.getService<NotificationServiceClient>(
        NOTIFICATION_SERVICE_NAME
      );
  }

  async readNotification(
    data: ReadNotificationRequest
  ): Promise<NotificationResponse> {
    return firstValueFrom(this.notificationService.readNotification(data));
  }

  async deleteNotification(
    data: DeleteNotificationRequest
  ): Promise<NotificationResponse> {
    return firstValueFrom(this.notificationService.deleteNotification(data));
  }
}
