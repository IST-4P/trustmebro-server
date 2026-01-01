import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateRoleRequestDto,
  DeleteRoleRequestDto,
  GetManyRolesRequestDto,
  GetRoleRequestDto,
  UpdateRoleRequestDto,
} from '@common/interfaces/dtos/role';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';

@Controller('role-admin')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getManyRoles(
    @Query() query: GetManyRolesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.roleService.getManyRoles({ ...query, processId });
  }

  @Get(':id')
  async getRole(
    @Param() params: GetRoleRequestDto,
    @ProcessId() processId: string
  ) {
    return this.roleService.getRole({ ...params, processId });
  }

  @Post()
  async createRole(
    @Body() body: CreateRoleRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.roleService.createRole({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateRole(
    @Body() body: UpdateRoleRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.roleService.updateRole({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteRole(
    @Param() params: DeleteRoleRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.roleService.deleteRole({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
