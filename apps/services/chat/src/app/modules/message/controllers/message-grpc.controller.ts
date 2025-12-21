import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateMessageRequest,
  GetManyMessagesRequest,
} from '@common/interfaces/models/chat';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MessageService } from '../services/message.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class MessageGrpcController {
  constructor(private readonly messageService: MessageService) {}

  @GrpcMethod(GrpcServiceName.CHAT_SERVICE, 'GetManyMessages')
  getManyMessages(data: GetManyMessagesRequest) {
    return this.messageService.list(data);
  }

  @GrpcMethod(GrpcServiceName.CHAT_SERVICE, 'CreateMessage')
  createMessage(data: CreateMessageRequest) {
    return this.messageService.create(data);
  }
}
