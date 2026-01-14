import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  ConversationResponseDto,
  CreateConversationRequestDto,
  GetManyConversationsRequestDto,
  GetManyConversationsResponseDto,
} from '@common/interfaces/dtos/chat';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ConversationReadService } from '../services/conversation-read.service';
import { ConversationWriteService } from '../services/conversation-write.service';

class GetManyConversationsBodyDto extends OmitType(
  GetManyConversationsRequestDto,
  ['processId', 'userId'] as const
) {}

class CreateConversationBodyDto extends OmitType(CreateConversationRequestDto, [
  'processId',
] as const) {}

@Controller('chat/conversation')
@ApiTags('Chat')
export class ConversationController {
  constructor(
    private readonly conversationWriteService: ConversationWriteService,
    private readonly conversationReadService: ConversationReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyConversationsResponseDto })
  async getManyConversations(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Query() queries: GetManyConversationsBodyDto
  ) {
    return this.conversationReadService.getManyConversations({
      ...queries,
      processId,
      userId,
    });
  }

  @Post()
  @ApiOkResponse({ type: ConversationResponseDto })
  async createConversation(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Body() body: CreateConversationBodyDto
  ) {
    return this.conversationWriteService.createConversation({
      processId,
      participantIds: [userId, body.participantIds[0]],
    });
  }
}
