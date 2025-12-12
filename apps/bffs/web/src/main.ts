/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { GrpcService } from '@common/configurations/grpc.config';
import { HttpMethodValues } from '@common/constants/http-method.constant';
import {
  CountResponse,
  ROLE_SERVICE_NAME,
  RoleServiceClient,
} from '@common/interfaces/proto-types/role';
import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('TrustMeBro-Web API')
    .setDescription('Quỳ xuống mà xin API đi bro')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

  const port = AppConfiguration.BFF_WEB_SERVICE_PORT || 3100;
  await app.listen(port);

  // Sync permissions with database
  await syncPermissions(app);
}

async function syncPermissions(app: INestApplication) {
  const grpcClient = app.get<ClientGrpc>(GrpcService.ROLE_SERVICE);
  const roleService =
    grpcClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);

  const role = await firstValueFrom(roleService.getRole({ name: 'CUSTOMER' }));
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
}

bootstrap();
