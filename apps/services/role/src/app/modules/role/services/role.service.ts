import {
  CreateRoleRequest,
  DeleteRoleRequest,
  GetManyRolesRequest,
  GetRoleRequest,
  UpdateRoleRequest,
} from '@common/interfaces/models/role/role';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../repositories/role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async list(data: GetManyRolesRequest) {
    const roles = await this.roleRepository.list(data);
    if (roles.totalItems === 0) {
      throw new NotFoundException('Error.ComplaintNotFound');
    }
    return roles;
  }

  async find(data: GetRoleRequest, withUserIds: boolean) {
    const role = await this.roleRepository.find(data, withUserIds);

    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return role;
  }

  async create(data: CreateRoleRequest) {
    const role = await this.roleRepository.find({ name: data.name }, false);
    if (role) {
      throw new NotFoundException('Error.RoleAlreadyExists');
    }
    return this.roleRepository.create(data);
  }

  async update(data: UpdateRoleRequest) {
    const role = await this.roleRepository.find({ id: data.id }, false);
    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return this.roleRepository.update(data);
  }

  async delete(data: DeleteRoleRequest) {
    const role = await this.roleRepository.find({ id: data.id }, false);
    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return this.roleRepository.delete(data);
  }
}
