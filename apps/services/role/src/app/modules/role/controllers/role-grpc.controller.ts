import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetManyRolesRequest,
  GetManyRolesResponse,
  GetRoleRequest,
  GetRoleResponse,
  UpdateRoleRequest,
} from '@common/interfaces/models/role/role';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from '../services/role.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class RoleGrpcController {
  constructor(private readonly roleService: RoleService) {}

  @GrpcMethod('RoleService', 'GetManyRoles')
  getManyRoles(data: GetManyRolesRequest): Promise<GetManyRolesResponse> {
    return this.roleService.list(data);
  }

  @GrpcMethod('RoleService', 'GetRole')
  getRole(data: GetRoleRequest): Promise<GetRoleResponse | null> {
    return this.roleService.find(data, true);
  }

  // @Get(':id')
  // getRole(@Param() data: GetRoleRequest): Promise<GetRoleResponse | null> {
  //   return this.roleService.find(data, true);
  // }

  @GrpcMethod('RoleService', 'GetRoleWithoutUserIds')
  getRoleWithoutUserIds(data: GetRoleRequest): Promise<GetRoleResponse | null> {
    return this.roleService.find(data, false);
  }

  @GrpcMethod('RoleService', 'CreateRole')
  createRole(data: CreateRoleRequest): Promise<GetRoleResponse> {
    return this.roleService.create(data);
  }

  @GrpcMethod('RoleService', 'UpdateRole')
  updateRole(data: UpdateRoleRequest): Promise<GetRoleResponse> {
    return this.roleService.update(data);
  }

  @GrpcMethod('RoleService', 'DeleteRole')
  deleteRole(data: DeleteRoleRequest): Promise<GetRoleResponse> {
    return this.roleService.delete(data);
  }
}
