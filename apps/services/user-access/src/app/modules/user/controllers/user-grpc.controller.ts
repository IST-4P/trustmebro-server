import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CheckParticipantExistsRequest,
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
} from '@common/interfaces/models/user-access';
import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetUser')
  getUser(@Body() body: GetUserRequest) {
    return this.userService.find(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateUser')
  createUser(@Body() body: CreateUserRequest) {
    return this.userService.create(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateUser')
  updateUser(@Body() body: UpdateUserRequest) {
    return this.userService.update(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CheckParticipantExists')
  checkParticipantExists(@Body() body: CheckParticipantExistsRequest) {
    return this.userService.checkParticipantExists(body);
  }
}
