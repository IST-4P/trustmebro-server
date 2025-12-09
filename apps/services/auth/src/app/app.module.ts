import { Module } from '@nestjs/common';
import { AuthGrpcController } from './controllers/auth-grpc.controller';
import { AuthService } from './services/auth.service';
import { KeycloakHttpService } from './services/keycloak-htpp.service';

@Module({
  imports: [],
  controllers: [AuthGrpcController],
  providers: [KeycloakHttpService, AuthService],
})
export class AppModule {}
