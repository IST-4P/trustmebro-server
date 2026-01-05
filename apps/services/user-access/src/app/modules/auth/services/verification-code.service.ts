import { BaseConfiguration } from '@common/configurations/base.config';
import { VerificationCodeValues } from '@common/constants/user.constant';
import {
  DeleteVerificationCodeRequest,
  SendVerificationCodeRequest,
  ValidateVerificationCodeRequest,
} from '@common/interfaces/models/auth';
import { generateOTP } from '@common/utils/generate-otp.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addMilliseconds } from 'date-fns';
import ms, { StringValue } from 'ms';
import { UserService } from '../../user/services/user.service';
import { VerificationCodeRepository } from '../repositories/verification-code.repository';
import { EmailService } from './email.service';

@Injectable()
export class VerificationCodeService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly verificationCodeRepository: VerificationCodeRepository
  ) {}

  async send(body: SendVerificationCodeRequest) {
    // Kiểm tra email có tồn tại hay chưa
    const user = await this.userService.find({
      email: body.email,
    });

    if (body.type === VerificationCodeValues.REGISTER && user) {
      throw new BadRequestException('Error.EmailAlreadyExists');
    }

    if (body.type === VerificationCodeValues.CHANGE_PASSWORD && !user) {
      throw new NotFoundException('Error.UserNotFound');
    }

    // Tạo mã OTP
    const code = generateOTP();
    await this.verificationCodeRepository.create({
      email: body.email,
      type: body.type,
      code,
      expiresAt: addMilliseconds(
        new Date(),
        ms(BaseConfiguration.OTP_EXPIRES as StringValue)
      ),
    });

    // Gửi OTP
    try {
      await this.emailService.sendVerificationCode({
        email: body.email,
        code,
      });
    } catch (error) {
      throw new BadRequestException('Error.SendVerificationCodeFailed');
    }

    return {
      message: 'Message.SendVerificationCodeSuccessfully',
    };
  }

  async validate(data: ValidateVerificationCodeRequest) {
    const verificationCode = await this.verificationCodeRepository.find({
      email_type: {
        email: data.email,
        type: data.type,
      },
    });

    if (!verificationCode) {
      throw new NotFoundException('Error.VerificationCodeNotFound');
    }

    if (verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Error.OTPExpired');
    }

    if (verificationCode.code !== data.code) {
      throw new BadRequestException('Error.InvalidOTP');
    }
  }

  delete(data: DeleteVerificationCodeRequest) {
    return this.verificationCodeRepository.delete({
      email_type: {
        email: data.email,
        type: data.type,
      },
    });
  }
}
