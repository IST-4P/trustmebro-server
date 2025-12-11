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

  async findById(data: GetRoleRequest) {
    const role = await this.roleRepository.find({ id: data.id });
    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return role;
  }

  async create(data: CreateRoleRequest) {
    console.log('first');
    const role = await this.roleRepository.find({ name: data.name });
    console.log('second');
    if (role) {
      throw new NotFoundException('Error.RoleAlreadyExists');
    }
    return this.roleRepository.create(data);
  }

  async update(data: UpdateRoleRequest) {
    const role = await this.roleRepository.find({ id: data.id });
    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return this.roleRepository.update(data);
  }

  async delete(data: DeleteRoleRequest) {
    const role = await this.roleRepository.find({ id: data.id });
    if (!role) {
      throw new NotFoundException('Error.RoleNotFound');
    }
    return this.roleRepository.delete(data);
  }
}
