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
import {
  Body,
  Controller,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from '../services/role.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class RoleGrpcController {
  constructor(private readonly roleService: RoleService) {}

  @GrpcMethod('RoleService', 'GetManyRoles')
  getManyRoles(
    @Query() queries: GetManyRolesRequest
  ): Promise<GetManyRolesResponse> {
    return this.roleService.list(queries);
  }

  @GrpcMethod('RoleService', 'GetRoleById')
  getRoleById(
    @Param() params: GetRoleRequest
  ): Promise<GetRoleResponse | null> {
    return this.roleService.findById(params);
  }

  @GrpcMethod('RoleService', 'CreateRole')
  async createRole(@Body() body: CreateRoleRequest): Promise<GetRoleResponse> {
    return this.roleService.create(body);
  }

  @GrpcMethod('RoleService', 'UpdateRole')
  async updateRole(@Body() body: UpdateRoleRequest): Promise<GetRoleResponse> {
    return this.roleService.update(body);
  }

  @GrpcMethod('RoleService', 'DeleteRole')
  async deleteRole(
    @Param() params: DeleteRoleRequest
  ): Promise<GetRoleResponse> {
    return this.roleService.delete(params);
  }
}
