import {
  GrpcClientProvider,
  GrpcService,
} from '@common/configurations/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthGrpcController } from './controllers/auth-grpc.controller';
import { AuthService } from './services/auth.service';
import { KeycloakHttpService } from './services/keycloak-htpp.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.ROLE_SERVICE)]),
  ],
  controllers: [AuthGrpcController],
  providers: [KeycloakHttpService, AuthService],
})
export class AuthModule {}
