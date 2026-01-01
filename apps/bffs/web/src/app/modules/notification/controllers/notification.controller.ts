import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  DeleteNotificationRequestDto,
  GetManyNotificationsRequestDto,
  ReadNotificationRequestDto,
} from '@common/interfaces/dtos/notification';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { NotificationReadService } from '../services/notification-read.service';
import { NotificationWriteService } from '../services/notification-write.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationWriteService: NotificationWriteService,
    private readonly notificationReadService: NotificationReadService
  ) {}

  @Get()
  async getManyNotifications(
    @Query() query: Omit<GetManyNotificationsRequestDto, 'userId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.notificationReadService.getManyNotifications({
      ...query,
      processId,
      userId,
    });
  }

  @Put()
  async updateNotification(
    @Body() body: ReadNotificationRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.notificationWriteService.readNotification({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteNotification(
    @Param() params: DeleteNotificationRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.notificationWriteService.deleteNotification({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
