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
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('UserAccessService', 'Register')
  async register(data: RegisterRequest): Promise<void> {
    return this.authService.register(data);
  }

  @GrpcMethod('UserAccessService', 'LoginDirectAccessGrants')
  async loginDirectAccessGrants(data: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.loginDirectAccessGrants(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }

  @GrpcMethod('UserAccessService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }

  @GrpcMethod('UserAccessService', 'Logout')
  async logout(data: LogoutRequest): Promise<void> {
    await this.authService.logout(data);
  }

  @GrpcMethod('UserAccessService', 'VerifyToken')
  async verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    return this.authService.verifyToken(data);
  }
}
