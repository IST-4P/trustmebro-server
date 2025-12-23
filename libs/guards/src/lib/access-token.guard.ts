import { MetadataKeys } from '@common/constants/common.constant';
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
  VerifyTokenResponse,
} from '@common/interfaces/proto-types/user-access';
import { getAccessToken } from '@common/utils/get-access.util';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { keyBy } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate, OnModuleInit {
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

  private async extractAndValidateToken(
    request: any
  ): Promise<VerifyTokenResponse> {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException('Error.AccessTokenNotFound');
    }

    const processId = request[MetadataKeys.PROCESS_ID];
    try {
      const decodedAccessToken = await firstValueFrom(
        this.userAccessService.verifyToken({
          token: accessToken,
          processId,
          withPermissions: true,
        })
      );
      request[MetadataKeys.USER_DATA] = decodedAccessToken;
      return decodedAccessToken;
    } catch (e) {
      throw new UnauthorizedException('Error.InvalidAccessToken');
    }
  }

  private async validateUserPermission(
    decodedAccessToken: VerifyTokenResponse,
    request: any
  ): Promise<void> {
    const path = request.route.path;
    const method = request.method;

    const permissionObject = keyBy(
      decodedAccessToken.permissions,
      (permission: any) => `${permission.path}:${permission.method}`
    );

    // Kiểm tra quyển truy cập
    const canAccess = permissionObject[`${path}:${method}`];
    if (!canAccess) {
      throw new ForbiddenException('Error.AccessDenied');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    //Extract và validate token
    const decodedAccessToken = await this.extractAndValidateToken(request);

    //Check user permission
    await this.validateUserPermission(decodedAccessToken, request);

    return true;
  }
}
