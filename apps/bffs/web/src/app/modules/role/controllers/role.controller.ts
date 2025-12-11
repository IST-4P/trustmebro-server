import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  CreateRoleRequestDto,
  GetManyRolesRequestDto,
  GetRoleByIdRequestDto,
} from '@common/interfaces/dtos/role';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getManyRoles(
    @Body() body: GetManyRolesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.roleService.getManyRoles({ ...body, processId });
  }

  @Get(':id')
  async getRoleById(
    @Param() params: GetRoleByIdRequestDto,
    @ProcessId() processId: string
  ) {
    return this.roleService.getRoleById({ id: params.id, processId });
  }

  @Post()
  async createRole(
    @Body() body: CreateRoleRequestDto,
    @ProcessId() processId: string
  ) {
    return this.roleService.createRole({ ...body, processId });
  }

  // @Put()
  // async updateRole(
  //   @Body() body: UpdateRoleRequestDto,
  //   @ProcessId() processId: string
  // ) {
  //   return this.roleService.updateRole({ ...body, processId });
  // }

  // @Delete(':id')
  // async deleteRole(
  //   @Param() params: DeleteRoleRequestDto,
  //   @ProcessId() processId: string
  // ) {
  //   return this.roleService.deleteRole({ id: params.id, processId });
  // }
}
