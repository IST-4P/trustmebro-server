import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { GetManyMessagesRequestDto } from '@common/interfaces/dtos/chat';
import { Controller, Get, Query } from '@nestjs/common';
import { MessageReadService } from '../services/message-read.service';

@Controller('chat/message')
export class MessageController {
  constructor(private readonly messageReadService: MessageReadService) {}

  @Get()
  async getManyMessages(
    @Query() query: Omit<GetManyMessagesRequestDto, 'senderId'>,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.messageReadService.getManyMessages({
      ...query,
      processId,
      senderId: userId,
    });
  }
}
