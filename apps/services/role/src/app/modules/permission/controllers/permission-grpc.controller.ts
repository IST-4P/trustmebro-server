import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CountResponse,
  CreateManyPermissionsRequest,
  CreatePermissionRequest,
  DeleteManyPermissionsRequest,
  DeletePermissionRequest,
  GetManyPermissionsRequest,
  GetManyPermissionsResponse,
  GetManyUniquePermissionsRequest,
  GetManyUniquePermissionsResponse,
  GetPermissionRequest,
  GetPermissionResponse,
  UpdatePermissionRequest,
} from '@common/interfaces/models/role/permission';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PermissionService } from '../services/permission.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class PermissionGrpcController {
  constructor(private readonly permissionService: PermissionService) {}

  @GrpcMethod('RoleService', 'GetManyPermissions')
  getManyPermissions(
    data: GetManyPermissionsRequest
  ): Promise<GetManyPermissionsResponse> {
    return this.permissionService.list(data);
  }

  @GrpcMethod('RoleService', 'GetManyUniquePermissions')
  getManyUniquePermissions(
    data: GetManyUniquePermissionsRequest
  ): Promise<GetManyUniquePermissionsResponse> {
    return this.permissionService.listUnique(data);
  }

  @GrpcMethod('RoleService', 'GetPermission')
  getPermission(
    data: GetPermissionRequest
  ): Promise<GetPermissionResponse | null> {
    return this.permissionService.findById(data);
  }

  @GrpcMethod('RoleService', 'CreatePermission')
  createPermission(
    data: CreatePermissionRequest
  ): Promise<GetPermissionResponse> {
    return this.permissionService.create(data);
  }

  @GrpcMethod('RoleService', 'CreateManyPermissions')
  createManyPermissions(
    data: CreateManyPermissionsRequest
  ): Promise<CountResponse> {
    return this.permissionService.createMany(data);
  }

  @GrpcMethod('RoleService', 'UpdatePermission')
  updatePermission(
    data: UpdatePermissionRequest
  ): Promise<GetPermissionResponse> {
    return this.permissionService.update(data);
  }

  @GrpcMethod('RoleService', 'DeletePermission')
  deletePermission(
    data: DeletePermissionRequest
  ): Promise<GetPermissionResponse> {
    return this.permissionService.delete(data);
  }

  @GrpcMethod('RoleService', 'DeleteManyPermissions')
  deleteManyPermissions(
    data: DeleteManyPermissionsRequest
  ): Promise<CountResponse> {
    return this.permissionService.deleteMany(data);
  }
}
