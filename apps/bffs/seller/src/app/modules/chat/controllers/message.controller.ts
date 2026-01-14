import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  GetManyMessagesRequestDto,
  GetManyMessagesResponseDto,
} from '@common/interfaces/dtos/chat';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { MessageReadService } from '../services/message-read.service';

class GetManyMessagesBodyDto extends OmitType(GetManyMessagesRequestDto, [
  'senderId',
  'processId',
] as const) {}

@Controller('chat/message')
@ApiTags('Chat')
export class MessageController {
  constructor(private readonly messageReadService: MessageReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyMessagesResponseDto })
  async getManyMessages(
    @Query() queries: GetManyMessagesBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.messageReadService.getManyMessages({
      ...queries,
      processId,
      senderId: userId,
    });
  }
}
