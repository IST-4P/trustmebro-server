import {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetManyRolesRequest,
  GetRoleByIdRequest,
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleServiceClient,
  UpdateRoleRequest,
} from '@common/interfaces/proto-types/role';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoleService implements OnModuleInit {
  private roleService!: RoleServiceClient;

  constructor(
    @Inject(ROLE_SERVICE_PACKAGE_NAME)
    private roleClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.roleService =
      this.roleClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);
  }

  async getManyRoles(data: GetManyRolesRequest) {
    return firstValueFrom(this.roleService.getManyRoles(data));
  }

  async getRoleById(data: GetRoleByIdRequest) {
    return firstValueFrom(this.roleService.getRoleById(data));
  }

  async createRole(data: CreateRoleRequest) {
    return firstValueFrom(this.roleService.createRole(data));
  }

  async updateRole(data: UpdateRoleRequest) {
    return firstValueFrom(this.roleService.updateRole(data));
  }

  async deleteRole(data: DeleteRoleRequest) {
    return firstValueFrom(this.roleService.deleteRole(data));
  }
}
