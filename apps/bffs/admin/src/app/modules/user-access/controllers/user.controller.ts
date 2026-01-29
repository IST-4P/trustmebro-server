import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyUsersRequestDto,
  GetManyUsersResponseDto,
  GetUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from '@common/interfaces/dtos/user-access';
import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { UserService } from '../services/user.service';

class GetUserBodyDto extends OmitType(GetUserRequestDto, [
  'processId',
  'phoneNumber',
  'email',
] as const) {}

class GetManyUsersBodyDto extends OmitType(GetManyUsersRequestDto, [
  'processId',
] as const) {}

class UpdateUserBodyDto extends OmitType(UpdateUserRequestDto, [
  'processId',
] as const) {}

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ type: GetManyUsersResponseDto })
  async getManyUsers(
    @ProcessId() processId: string,
    @Query() queries: GetManyUsersBodyDto
  ) {
    return this.userService.getManyUsers({ ...queries, processId });
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  async getUser(
    @ProcessId() processId: string,
    @Query() queries: GetUserBodyDto
  ) {
    return this.userService.getUser({ ...queries, processId });
  }

  @Put()
  @ApiOkResponse({ type: UserResponseDto })
  async updateUser(
    @Body() body: UpdateUserBodyDto,
    @ProcessId() processId: string
  ) {
    return this.userService.updateUser({
      ...body,
      processId,
    });
  }
}
