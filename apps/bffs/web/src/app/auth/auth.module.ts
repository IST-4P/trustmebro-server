import { GrpcProvider, GrpcService } from '@common/configurations/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [ClientsModule.register([GrpcProvider(GrpcService.AUTH_SERVICE)])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
