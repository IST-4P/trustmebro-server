import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateConversationRequestDto,
  GetManyConversationsRequestDto,
} from '@common/interfaces/dtos/chat';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConversationReadService } from '../services/conversation-read.service';
import { ConversationWriteService } from '../services/conversation-write.service';

@Controller('chat/conversation')
export class ConversationController {
  constructor(
    private readonly conversationWriteService: ConversationWriteService,
    private readonly conversationReadService: ConversationReadService
  ) {}

  @Get()
  async getManyConversations(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Query()
    queries: Omit<GetManyConversationsRequestDto, 'userId'>
  ) {
    return this.conversationReadService.getManyConversations({
      ...queries,
      processId,
      userId,
    });
  }

  @Post()
  async createConversation(
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @Body() body: CreateConversationRequestDto
  ) {
    return this.conversationWriteService.createConversation({
      processId,
      participantIds: [userId, ...body.participantIds],
    });
  }
}
