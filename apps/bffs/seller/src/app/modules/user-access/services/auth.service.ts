import { DefaultRoleNameValues } from '@common/constants/user.constant';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import {
  ForbiddenException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async loginDirectAccessGrants(data: LoginRequest) {
    const result = await firstValueFrom(
      this.userAccessService.loginDirectAccessGrants(data)
    );
    const verifyToken = await firstValueFrom(
      this.userAccessService.verifyToken({
        token: result.accessToken,
        processId: data.processId,
        withPermissions: false,
      })
    );
    if (verifyToken.roleName !== DefaultRoleNameValues.SELLER) {
      throw new ForbiddenException('Error.AccessDenied');
    }
    return result;
  }

  async refreshToken(data: RefreshTokenRequest) {
    return firstValueFrom(this.userAccessService.refreshToken(data));
  }

  async logout(data: LogoutRequest) {
    await firstValueFrom(this.userAccessService.logout(data));
  }
}
