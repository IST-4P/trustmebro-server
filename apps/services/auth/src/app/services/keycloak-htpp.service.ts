import { KeycloakConfiguration } from '@common/configurations/keycloak.config';
import { ExchangeClientTokenResponse } from '@common/interfaces/common/keycloak.interface';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '@common/interfaces/models/auth';
import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KeycloakHttpService {
  private readonly logger = new Logger(KeycloakHttpService.name);
  private readonly axiosInstance: AxiosInstance;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: KeycloakConfiguration.KEYCLOAK_HOST,
    });

    this.realm = KeycloakConfiguration.KEYCLOAK_REALM;
    this.clientId = KeycloakConfiguration.KEYCLOAK_CLIENT_ID;
    this.clientSecret = KeycloakConfiguration.KEYCLOAK_CLIENT_SECRET;
  }

  async exchangeClientToken(): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();

    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('grant_type', 'client_credentials');
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  }

  async loginDirectAccessGrants(
    request: LoginRequest
  ): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();

    body.append('grant_type', 'password');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('username', request.username);
    body.append('password', request.password);
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  }

  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();

    body.append('grant_type', 'refresh_token');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('refresh_token', request.refreshToken);

    const { data } = await this.axiosInstance.post(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  }

  async logout(request: LogoutRequest) {
    const body = new URLSearchParams();
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('refresh_token', request.refreshToken);

    await this.axiosInstance.post(
      `/realms/${this.realm}/protocol/openid-connect/logout`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }
}
