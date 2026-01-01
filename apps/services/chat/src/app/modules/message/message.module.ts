import { Module } from '@nestjs/common';
import { MessageGrpcController } from './controllers/message-grpc.controller';
import { MessageRepository } from './repositories/message.repository';
import { MessageService } from './services/message.service';

@Module({
  controllers: [MessageGrpcController],
  providers: [MessageRepository, MessageService],
})
export class MessageModule {}
