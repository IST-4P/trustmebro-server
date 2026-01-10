import { KeycloakConfiguration } from '@common/configurations/keycloak.config';
import {
  CreateKeyCloakUserRequest,
  ExchangeClientTokenResponse,
} from '@common/interfaces/common/keycloak.interface';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
} from '@common/interfaces/models/auth';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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

  async createUser(data: CreateKeyCloakUserRequest): Promise<string> {
    const { email, firstName, lastName, password, username } = data;

    const { access_token: accessToken } = await this.exchangeClientToken();

    let headers: any;
    try {
      headers = await this.axiosInstance.post(
        `/admin/realms/${this.realm}/users`,
        {
          firstName,
          lastName,
          email,
          username,
          enabled: true,
          emailVerified: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new InternalServerErrorException('Error.UserAlreadyExists');
      }

      throw new InternalServerErrorException('Error.CannotCreateUser');
    }

    const userId = headers.headers['location']?.split('/').pop();

    if (!userId) {
      throw new InternalServerErrorException('Error.CannotCreateUser');
    }
    this.logger.log(`User created in keycloak with id: ${userId}`);
    return userId;
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

  async changePassword(data: {
    userId: string;
    newPassword: string;
  }): Promise<void> {
    const { access_token: accessToken } = await this.exchangeClientToken();
    try {
      await this.axiosInstance.put(
        `/admin/realms/${this.realm}/users/${data.userId}/reset-password`,
        {
          type: 'password',
          value: data.newPassword,
          temporary: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error.CannotChangePassword');
    }
  }
}
