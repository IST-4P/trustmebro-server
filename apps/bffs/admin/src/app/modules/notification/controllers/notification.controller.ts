import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateNotificationRequestDto,
  GetManyNotificationsRequestDto,
} from '@common/interfaces/dtos/notification';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationReadService } from '../services/notification-read.service';
import { NotificationWriteService } from '../services/notification-write.service';

@Controller('notification-admin')
export class NotificationController {
  constructor(
    private readonly notificationWriteService: NotificationWriteService,
    private readonly notificationReadService: NotificationReadService
  ) {}

  @Get()
  async getManyNotifications(
    @Query() query: GetManyNotificationsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.notificationReadService.getManyNotifications({
      ...query,
      processId,
    });
  }

  @Post()
  async createNotification(
    @Body() body: CreateNotificationRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.notificationWriteService.createNotification({
      ...body,
      processId,
      createdById: userId,
    });
  }
}
