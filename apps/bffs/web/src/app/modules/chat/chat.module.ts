import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { MessageGateway } from '@common/redis/gateway/message.gateway';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConversationSseController } from './controllers/conversation-sse.controller';
import { ConversationController } from './controllers/conversation.controller';
import { MessageController } from './controllers/message.controller';
import { ConversationReadService } from './services/conversation-read.service';
import { ConversationWriteService } from './services/conversation-write.service';
import { MessageReadService } from './services/message-read.service';
import { ConversationSubscriber } from './subscribers/conversation.subscriber';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.CHAT_SERVICE)]),
  ],
  controllers: [
    MessageController,
    ConversationController,
    ConversationSseController,
  ],
  providers: [
    ConversationWriteService,
    ConversationReadService,
    MessageReadService,
    MessageGateway,
    ConversationSubscriber,
  ],
})
export class ChatModule {}
