import {
  LoginRequest,
  RefreshTokenRequest,
} from '@common/interfaces/models/auth';
import { Injectable } from '@nestjs/common';
import { KeycloakHttpService } from './keycloak-htpp.service';

@Injectable()
export class AuthService {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  loginDirectAccessGrants(data: LoginRequest) {
    return this.keycloakHttpService.loginDirectAccessGrants(data);
  }

  refreshToken(data: RefreshTokenRequest) {
    return this.keycloakHttpService.refreshToken(data);
  }
}
