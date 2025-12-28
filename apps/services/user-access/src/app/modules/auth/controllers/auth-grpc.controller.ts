import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from '@common/interfaces/models/auth';
import { MessageResponse } from '@common/interfaces/models/common/response.model';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'Register')
  async register(data: RegisterRequest): Promise<MessageResponse> {
    return this.authService.register(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'LoginDirectAccessGrants')
  async loginDirectAccessGrants(data: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.loginDirectAccessGrants(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'RefreshToken')
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'Logout')
  async logout(data: LogoutRequest): Promise<MessageResponse> {
    return this.authService.logout(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'VerifyToken')
  async verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    return this.authService.verifyToken(data);
  }
}
