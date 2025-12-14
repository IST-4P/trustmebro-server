import { BaseConfiguration } from '@common/configurations/base.config';
import { GrpcService } from '@common/configurations/grpc.config';
import { HttpMethodValues } from '@common/constants/http-method.constant';
import { DefaultRoleName } from '@common/constants/user.constant';
import {
  CountResponse,
  ROLE_SERVICE_NAME,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import { INestApplication, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const syncPermissions = async (
  app: INestApplication,
  roleName: DefaultRoleName
) => {
  let grpcClient: ClientGrpc;

  try {
    grpcClient = app.get<ClientGrpc>(GrpcService.ROLE_SERVICE);
  } catch (error) {
    Logger.warn('Failed to connect to gRPC service, retrying in 15 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 15000));

    try {
      grpcClient = app.get<ClientGrpc>(GrpcService.ROLE_SERVICE);
    } catch (retryError) {
      Logger.error('Failed to connect to gRPC service after retry', retryError);
      throw retryError;
    }
  }

  const roleService =
    grpcClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);

  const role = await firstValueFrom(
    roleService.getRole({
      name: roleName,
      withInheritance: false,
    })
  );
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;
  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api/v1';

  const permissionInDb = role.permissions || [];

  let availableRoutes: {
    path: string;
    method: keyof typeof HttpMethodValues;
    module: string;
    name: string;
  }[] = router.stack
    .map((layer: any) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = String(
          layer.route?.stack[0].method
        ).toUpperCase() as keyof typeof HttpMethodValues;
        // Remove global prefix to get actual module name
        // e.g., /api/v1/auth/login -> auth
        const pathWithoutPrefix = path.replace(`/${globalPrefix}/`, '');
        const moduleName = String(
          pathWithoutPrefix.split('/')[0]
        ).toUpperCase();
        return {
          path,
          method,
          name: method + ' ' + path,
          module: moduleName,
        };
      }
      return undefined;
    })
    .filter((item: any) => item !== undefined);

  availableRoutes = availableRoutes.filter((route) => {
    // Loại bỏ các route không cần thiết
    const unnecessaryModules = ['DOCS', 'DOCS-JSON', `DOCS-YAML`];
    if (unnecessaryModules.includes(route.module)) {
      return false;
    }
    return true;
  });

  //Tạo object PermissionInDbMap với key là [method-path]
  const permissionInDbMap = permissionInDb.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {} as Record<string, any>);
  Logger.debug('Permission in DB Map: ', permissionInDbMap);

  //Tạo object availableRoutesMap với key là [method-path]
  const availableRoutesMap = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item;
    return acc;
  }, {} as Record<string, any>);
  Logger.debug('Available Routes Map: ', availableRoutesMap);

  //Tìm permission trong db mà k tồn tại trong available
  const permissionToDelete = permissionInDb.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`];
  });
  Logger.debug('Permission to delete: ', permissionToDelete);

  //Xoá permission không tồn tại trong availableRoutes
  let deleteResult: CountResponse = { count: 0 };
  if (permissionToDelete.length > 0) {
    deleteResult = await firstValueFrom(
      roleService.deleteManyPermissions({
        ids: permissionToDelete.map((item) => item.id),
      })
    );
    Logger.log(`Delete : ${deleteResult.count}`);
  } else {
    Logger.log('No permission to delete');
  }

  //Tìm route không tồn tại trong permissionInDb
  const routesToAdd = availableRoutes.filter((item) => {
    return !permissionInDbMap[`${item.method}-${item.path}`];
  });

  //Thêm các route
  let permissionToAdd: CountResponse = { count: 0 };
  if (routesToAdd.length > 0) {
    permissionToAdd = await firstValueFrom(
      roleService.createManyPermissions({
        permissions: routesToAdd,
      })
    );
    Logger.log(`Add : ${permissionToAdd.count}`);
  } else {
    Logger.log('No permission to add');
  }

  if (permissionToAdd.count > 0 || deleteResult.count > 0) {
    const updatedPermissionInDb = await firstValueFrom(
      roleService.getManyUniquePermissions({
        names: availableRoutes.map((item) => item.name),
      })
    );

    await firstValueFrom(
      roleService.updateRole({
        id: role.id,
        updatedById: 'SYSTEM',
        permissionIds: updatedPermissionInDb.permissions.map((item) => item.id),
      })
    );
  }
};
