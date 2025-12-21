import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { ConversationGateway } from '@common/redis/gateway/conversation.gateway';
import { MessageGateway } from '@common/redis/gateway/message.gateway';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MessageController } from './controllers/message.controller';
import { MessageReadService } from './services/message-read.service';
import { ConversationSubscriber } from './subscribers/conversation.subscriber';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.CHAT_SERVICE)]),
  ],
  controllers: [MessageController],
  providers: [
    MessageReadService,
    MessageGateway,
    ConversationGateway,
    ConversationSubscriber,
  ],
})
export class ChatModule {}
