import {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetManyRolesRequest,
  GetManyRolesResponse,
  GetRoleResponse,
  UpdateRoleRequest,
} from '@common/interfaces/models/role/role';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/role';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyRolesRequest): Promise<GetManyRolesResponse> {
    const skip = Number((data.page - 1) * data.limit);
    const take = Number(data.limit);

    const [totalItems, roles] = await Promise.all([
      this.prismaService.role.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.role.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
        },
        skip,
        take,
      }),
    ]);
    return {
      roles,
      page: data.page,
      limit: data.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  find(
    data: Prisma.RoleWhereInput,
    withUserIds: boolean
  ): Promise<GetRoleResponse | null> {
    const where: Prisma.RoleWhereInput = {
      deletedAt: null,
    };
    if (data.id) {
      where.id = data.id;
    }
    if (data.name) {
      where.name = data.name;
    }
    return this.prismaService.role.findFirst({
      where,
      omit: {
        userIds: !withUserIds,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
          select: {
            path: true,
            method: true,
          },
        },
      },
    });
  }

  create(data: CreateRoleRequest): Promise<GetRoleResponse> {
    return this.prismaService.role.create({
      data: {
        ...data,
        createdById: data.createdById,
      },
      include: {
        permissions: {
          select: {
            path: true,
            method: true,
          },
        },
      },
    });
  }

  async update(data: UpdateRoleRequest): Promise<GetRoleResponse> {
    // Kt nếu có permissionID nào đã soft delete thì không cho phép cập nhập
    if (data.permissionIds.length > 0) {
      const permissions = await this.prismaService.permission.findMany({
        where: {
          id: {
            in: data.permissionIds,
          },
        },
      });

      const deletedPermission = permissions.filter(
        (permission) => permission.deletedAt
      );
      if (deletedPermission.length > 0) {
        const deletedIds = deletedPermission
          .map((permission) => permission.id)
          .join(', ');
        throw new BadRequestException(
          `Permission with ids have been deleted : ${deletedIds}`
        );
      }
    }
    return this.prismaService.role.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        name: data.name,
        description: data.description,
        permissions: {
          set: data.permissionIds.map((id) => ({ id })),
        },
        updatedById: data.updatedById,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
          select: {
            path: true,
            method: true,
          },
        },
      },
    });
  }

  delete(data: DeleteRoleRequest): Promise<GetRoleResponse> {
    return this.prismaService.role.update({
      where: {
        id: data.id,
        deletedAt: null,
      },
      data: {
        deletedById: data.deletedById,
        deletedAt: new Date(),
      },
      include: {
        permissions: {
          select: {
            path: true,
            method: true,
          },
        },
      },
    });
  }
}
