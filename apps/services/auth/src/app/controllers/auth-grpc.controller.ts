import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@common/interfaces/models/auth';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'LoginDirectAccessGrants')
  async loginDirectAccessGrants(data: LoginRequest): Promise<LoginResponse> {
    const result = await this.authService.loginDirectAccessGrants(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(data);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshExpiresIn: result.refresh_expires_in,
    };
  }
}
