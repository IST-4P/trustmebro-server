import { QueueTopics } from '@common/constants/queue.constant';
import { SendOtpRequest } from '@common/interfaces/models/auth';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthConsumerController {
  constructor(private readonly authService: AuthService) {}

  @EventPattern(QueueTopics.USER_ACCESS.SEND_OTP)
  sendOtp(@Payload() payload: SendOtpRequest) {
    this.authService.sendOtp(payload);
  }
}
