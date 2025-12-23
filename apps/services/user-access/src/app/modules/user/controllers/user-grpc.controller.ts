import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateUserRequest,
  UserResponse,
} from '@common/interfaces/models/user';
import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../services/user.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateUser')
  createUser(@Body() body: CreateUserRequest): Promise<UserResponse> {
    return this.userService.createUser(body);
  }
}
