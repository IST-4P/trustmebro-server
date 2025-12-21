import { Module } from '@nestjs/common';
import { ConversationGrpcController } from './controllers/conversation-grpc.controller';
import { ConversationRepository } from './repositories/conversation.repository';
import { ConversationService } from './services/conversation.service';

@Module({
  controllers: [ConversationGrpcController],
  providers: [ConversationRepository, ConversationService],
})
export class ConversationModule {}
