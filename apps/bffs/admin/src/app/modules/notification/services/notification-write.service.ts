import { CreateNotificationRequest } from '@common/interfaces/models/notification';
import {
  NOTIFICATION_SERVICE_NAME,
  NOTIFICATION_SERVICE_PACKAGE_NAME,
  NotificationResponse,
  NotificationServiceClient,
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

  async createNotification(
    data: CreateNotificationRequest
  ): Promise<NotificationResponse> {
    return firstValueFrom(this.notificationService.createNotification(data));
  }
}
