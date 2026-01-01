import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConversationGrpcController } from './controllers/conversation-grpc.controller';
import { ConversationRepository } from './repositories/conversation.repository';
import { ConversationService } from './services/conversation.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [ConversationGrpcController],
  providers: [ConversationRepository, ConversationService],
})
export class ConversationModule {}
