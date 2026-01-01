import {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetManyRolesRequest,
  GetManyRolesResponse,
  GetRoleRequest,
  ROLE_SERVICE_NAME,
  ROLE_SERVICE_PACKAGE_NAME,
  RoleResponse,
  RoleServiceClient,
  UpdateRoleRequest,
} from '@common/interfaces/proto-types/role';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoleService implements OnModuleInit {
  private productService!: RoleServiceClient;

  constructor(
    @Inject(ROLE_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<RoleServiceClient>(ROLE_SERVICE_NAME);
  }

  async getManyRoles(data: GetManyRolesRequest): Promise<GetManyRolesResponse> {
    return firstValueFrom(this.productService.getManyRoles(data));
  }

  async getRole(data: GetRoleRequest): Promise<RoleResponse> {
    return firstValueFrom(this.productService.getRole(data));
  }

  async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    return firstValueFrom(this.productService.createRole(data));
  }

  async updateRole(data: UpdateRoleRequest): Promise<RoleResponse> {
    return firstValueFrom(this.productService.updateRole(data));
  }

  async deleteRole(data: DeleteRoleRequest): Promise<RoleResponse> {
    return firstValueFrom(this.productService.deleteRole(data));
  }
}
