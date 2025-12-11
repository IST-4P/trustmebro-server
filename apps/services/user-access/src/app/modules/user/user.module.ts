import { Module } from '@nestjs/common';
import { UserGrpcController } from './controllers/user-grpc.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserGrpcController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
