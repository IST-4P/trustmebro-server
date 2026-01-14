import {
  GetUserRequest,
  UpdateUserRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { KafkaService } from '@common/kafka/kafka.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async getUser(data: GetUserRequest) {
    return firstValueFrom(this.userAccessService.getUser(data));
  }

  async updateUser(data: UpdateUserRequest) {
    return firstValueFrom(this.userAccessService.updateUser(data));
  }
}
