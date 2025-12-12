/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import {
  GrpcServerOptions,
  GrpcService,
} from '@common/configurations/grpc.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PrismaService } from './app/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppConfiguration.ROLE_SERVICE_PORT || 3002;

  app.connectMicroservice(GrpcServerOptions(GrpcService.ROLE_SERVICE));
  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  // Initialize roles and role inheritance
  await initializeRolesAndInheritance();
}

async function initializeRolesAndInheritance() {
  const prisma = new PrismaService();

  try {
    // Định nghĩa các roles cần tạo
    const rolesToCreate = [
      {
        name: 'ADMIN',
        description: 'Admin role with full permissions',
      },
      {
        name: 'CUSTOMER',
        description: 'Customer role with basic permissions',
      },
      {
        name: 'SELLER',
        description: 'Seller role',
      },
      {
        name: 'MANAGER',
        description: 'Manager role',
      },
    ];

    // Lấy danh sách roles hiện có
    const existingRoles = await prisma.role.findMany({
      where: {
        deletedAt: null,
        name: {
          in: rolesToCreate.map((r) => r.name),
        },
      },
    });

    const existingRoleNames = existingRoles.map((r) => r.name);

    // Tạo các roles chưa tồn tại
    const rolesToAdd = rolesToCreate.filter(
      (r) => !existingRoleNames.includes(r.name)
    );

    if (rolesToAdd.length > 0) {
      await prisma.role.createMany({
        data: rolesToAdd,
        skipDuplicates: true,
      });
      Logger.log(
        `Created ${rolesToAdd.length} new roles: ${rolesToAdd
          .map((r) => r.name)
          .join(', ')}`
      );
    } else {
      Logger.log('All roles already exist');
    }

    // Lấy lại tất cả roles sau khi tạo
    const allRoles = await prisma.role.findMany({
      where: {
        deletedAt: null,
        name: {
          in: ['CUSTOMER', 'SELLER', 'MANAGER', 'ADMIN'],
        },
      },
    });

    const roleMap = allRoles.reduce((acc, role) => {
      acc[role.name] = role;
      return acc;
    }, {} as Record<string, (typeof allRoles)[0]>);

    // Định nghĩa các quan hệ RoleInheritance (customer là cha)
    const inheritanceToCreate = [
      {
        parentId: roleMap['CUSTOMER']?.id,
        childId: roleMap['SELLER']?.id,
        description: 'Customer -> Seller',
      },
      {
        parentId: roleMap['CUSTOMER']?.id,
        childId: roleMap['MANAGER']?.id,
        description: 'Customer -> Manager',
      },
      {
        parentId: roleMap['CUSTOMER']?.id,
        childId: roleMap['ADMIN']?.id,
        description: 'Customer -> Admin',
      },
    ];

    // Kiểm tra các inheritance đã tồn tại
    const existingInheritances = await prisma.roleInheritance.findMany({
      where: {
        OR: inheritanceToCreate.map((i) => ({
          parentId: i.parentId,
          childId: i.childId,
        })),
      },
    });

    const existingInheritanceKeys = existingInheritances.map(
      (i) => `${i.parentId}-${i.childId}`
    );

    // Tạo các inheritance chưa tồn tại
    const inheritanceToAdd = inheritanceToCreate.filter(
      (i) => !existingInheritanceKeys.includes(`${i.parentId}-${i.childId}`)
    );

    for (const inheritance of inheritanceToAdd) {
      if (inheritance.parentId && inheritance.childId) {
        await prisma.roleInheritance.create({
          data: {
            parentId: inheritance.parentId,
            childId: inheritance.childId,
          },
        });
        Logger.log(`Created inheritance: ${inheritance.description}`);
      }
    }

    if (inheritanceToAdd.length === 0) {
      Logger.log('All role inheritances already exist');
    }

    Logger.log('✅ Roles and inheritances initialization completed');
  } catch (error) {
    Logger.error('Error initializing roles and inheritances:', error);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
