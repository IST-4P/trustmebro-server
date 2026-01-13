import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  DeleteNotificationRequestDto,
  GetManyNotificationsRequestDto,
  GetManyNotificationsResponseDto,
  GetNotificationResponseDto,
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
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { NotificationReadService } from '../services/notification-read.service';
import { NotificationWriteService } from '../services/notification-write.service';

class GetManyNotificationsBodyDto extends OmitType(
  GetManyNotificationsRequestDto,
  ['userId', 'processId'] as const
) {}

class ReadNotificationBodyDto extends OmitType(ReadNotificationRequestDto, [
  'updatedById',
  'processId',
] as const) {}

class DeleteNotificationParamsDto extends OmitType(
  DeleteNotificationRequestDto,
  ['deletedById', 'processId'] as const
) {}

@Controller('notification-seller')
@ApiTags('Notification')
export class NotificationController {
  constructor(
    private readonly notificationWriteService: NotificationWriteService,
    private readonly notificationReadService: NotificationReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyNotificationsResponseDto })
  async getManyNotifications(
    @Query() queries: GetManyNotificationsBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.notificationReadService.getManyNotifications({
      ...queries,
      processId,
      userId,
    });
  }

  @Put()
  @ApiOkResponse({ type: GetNotificationResponseDto })
  async updateNotification(
    @Body() body: ReadNotificationBodyDto,
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
  @ApiOkResponse({ type: GetNotificationResponseDto })
  async deleteNotification(
    @Param() params: DeleteNotificationParamsDto,
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
