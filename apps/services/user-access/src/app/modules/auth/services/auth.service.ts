import { BaseConfiguration } from '@common/configurations/base.config';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '@common/interfaces/models/auth';
import {
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../user/services/user.service';
import { KeycloakHttpService } from './keycloak-htpp.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private roleService!: RoleServiceClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly userService: UserService,
    @Inject(ROLE_SERVICE_PACKAGE_NAME)
    private roleClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.roleService =
      this.roleClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);
  }

  loginDirectAccessGrants(data: LoginRequest) {
    return this.keycloakHttpService.loginDirectAccessGrants(data);
  }

  refreshToken(data: RefreshTokenRequest) {
    return this.keycloakHttpService.refreshToken(data);
  }

  logout(data: LogoutRequest) {
    return this.keycloakHttpService.logout(data);
  }

  async register(data: RegisterRequest) {
    const userId = await this.keycloakHttpService.createUser(data);
    const roleCustomer = await firstValueFrom(
      this.roleService.getRoleWithoutUserIds({
        name: 'CUSTOMER',
      })
    );
    await this.userService.createUser({
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      phoneNumber: data.phoneNumber,
      avatar: BaseConfiguration.AVATAR_DEFAULT_URL,
      gender: data.gender,
      roleId: roleCustomer.id,
      roleName: roleCustomer.name,
    });
  }
}
