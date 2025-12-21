import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateConversationRequest,
  GetManyConversationsRequest,
  UpdateConversationRequest,
} from '@common/interfaces/models/chat';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ConversationService } from '../services/conversation.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ConversationGrpcController {
  constructor(private readonly conversationService: ConversationService) {}

  @GrpcMethod(GrpcServiceName.CHAT_SERVICE, 'GetManyConversations')
  getManyConversations(data: GetManyConversationsRequest) {
    return this.conversationService.list(data);
  }

  @GrpcMethod(GrpcServiceName.CHAT_SERVICE, 'CreateConversation')
  createConversation(data: CreateConversationRequest) {
    return this.conversationService.create(data);
  }

  @GrpcMethod(GrpcServiceName.CHAT_SERVICE, 'UpdateConversation')
  updateConversation(data: UpdateConversationRequest) {
    return this.conversationService.update(data);
  }
}
