import { MetadataKeys } from '@common/constants/common.constant';
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
  VerifyTokenResponse,
} from '@common/interfaces/proto-types/user-access';
import { getAccessToken } from '@common/utils/get-access.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { keyBy } from 'lodash';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate, OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  private generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }

  private async extractAndValidateToken(
    request: any
  ): Promise<VerifyTokenResponse> {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      throw new UnauthorizedException('Error.AccessTokenNotFound');
    }

    const cacheKey = this.generateTokenCacheKey(accessToken);

    const cacheData = await this.cacheManager.get<VerifyTokenResponse>(
      cacheKey
    );

    if (cacheData) {
      return cacheData;
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

      if (!decodedAccessToken.isValid) {
        throw new UnauthorizedException('Error.InvalidAccessToken');
      }
      this.cacheManager.set(cacheKey, decodedAccessToken, 30 * 60 * 1000);
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
