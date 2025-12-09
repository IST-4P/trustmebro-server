import {
  LoginRequest,
  RefreshTokenRequest,
} from '@common/interfaces/models/auth';
import {
  AUTH_SERVICE_NAME,
  AUTH_SERVICE_PACKAGE_NAME,
  AuthServiceClient,
} from '@common/interfaces/proto-types/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService!: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_PACKAGE_NAME)
    private authClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.authService =
      this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async loginDirectAccessGrants(data: LoginRequest) {
    const result = await firstValueFrom(
      this.authService.loginDirectAccessGrants(data)
    );
    return result;
  }

  async refreshToken(data: RefreshTokenRequest) {
    const result = await firstValueFrom(this.authService.refreshToken(data));
    return result;
  }
}
