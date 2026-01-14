import { QueueTopics } from '@common/constants/queue.constant';
import {
  ChangePasswordRequest,
  SendVerificationCodeRequest,
} from '@common/interfaces/models/auth';
import {
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { KafkaService } from '@common/kafka/kafka.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
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

  async loginDirectAccessGrants(data: LoginRequest) {
    return firstValueFrom(this.userAccessService.loginDirectAccessGrants(data));
  }

  async refreshToken(data: RefreshTokenRequest) {
    return firstValueFrom(this.userAccessService.refreshToken(data));
  }

  async logout(data: LogoutRequest) {
    await firstValueFrom(this.userAccessService.logout(data));
  }

  async register(data: RegisterRequest) {
    return firstValueFrom(this.userAccessService.register(data));
  }

  async changePassword(data: ChangePasswordRequest) {
    return firstValueFrom(this.userAccessService.changePassword(data));
  }

  sendVerificationCode(data: SendVerificationCodeRequest) {
    this.kafkaService.emit(QueueTopics.USER_ACCESS.SEND_OTP, data);
  }
}
