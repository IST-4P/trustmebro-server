import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CheckParticipantExistsRequest,
  CreateUserRequest,
  GetManyInformationUsersRequest,
  GetManyUsersRequest,
  GetUserRequest,
  UpdateUserRequest,
} from '@common/interfaces/models/user-access';
import { Controller, NotFoundException, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetUser')
  async getUser(data: GetUserRequest) {
    const user = await this.userService.find(data);
    if (!user) {
      throw new NotFoundException('Error.UserNotFound');
    }
    return user;
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetManyUsers')
  getManyUsers(data: GetManyUsersRequest) {
    return this.userService.list(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateUser')
  createUser(data: CreateUserRequest) {
    return this.userService.create(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateUser')
  updateUser(data: UpdateUserRequest) {
    return this.userService.update(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CheckParticipantExists')
  checkParticipantExists(data: CheckParticipantExistsRequest) {
    return this.userService.checkParticipantExists(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetManyInformationUsers')
  getManyInformationUsers(data: GetManyInformationUsersRequest) {
    return this.userService.getManyInformationUsers(data);
  }
}
