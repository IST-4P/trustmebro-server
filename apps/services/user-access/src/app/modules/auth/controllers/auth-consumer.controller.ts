import { QueueTopics } from '@common/constants/queue.constant';
import { SendVerificationCodeRequest } from '@common/interfaces/models/auth';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VerificationCodeService } from '../services/verification-code.service';

@Controller()
export class AuthConsumerController {
  constructor(
    private readonly verificationCodeService: VerificationCodeService
  ) {}

  @EventPattern(QueueTopics.USER_ACCESS.SEND_OTP)
  sendVerificationCode(@Payload() payload: SendVerificationCodeRequest) {
    this.verificationCodeService.send(payload);
  }
}
