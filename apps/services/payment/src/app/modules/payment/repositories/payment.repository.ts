import { PaymentStatusValues } from '@common/constants/payment.constant';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/payment';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.PaymentCreateInput) {
    return this.prismaService.payment.create({
      data,
    });
  }

  update(data: Prisma.PaymentUpdateInput) {
    return this.prismaService.payment.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
    });
  }

  delete(data: Prisma.PaymentWhereInput, isHard?: boolean) {
    return isHard
      ? this.prismaService.payment.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.payment.update({
          where: {
            id: data.id as string,
            deletedAt: null,
          },
          data: {
            status: PaymentStatusValues.CANCELLED,
            deletedAt: new Date(),
            deletedById: data.deletedById as string,
          },
        });
  }
}
