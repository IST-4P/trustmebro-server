import { Injectable } from '@nestjs/common';
import { Prisma, VerificationCode } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VerificationCodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  find(
    uniqueValue: Prisma.VerificationCodeWhereUniqueInput
  ): Promise<VerificationCode | null> {
    return this.prismaService.verificationCode.findUniqueOrThrow({
      where: uniqueValue,
    });
  }

  delete(
    body: Prisma.VerificationCodeWhereUniqueInput
  ): Promise<VerificationCode> {
    return this.prismaService.verificationCode.delete({
      where: body,
    });
  }

  create(body: Prisma.VerificationCodeCreateInput): Promise<VerificationCode> {
    return this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: body.email,
          type: body.type,
        },
      },
      create: body,
      update: {
        code: body.code,
        expiresAt: body.expiresAt,
      },
    });
  }
}
