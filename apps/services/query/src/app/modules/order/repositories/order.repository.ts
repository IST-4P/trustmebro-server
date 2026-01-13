import {
  GetManyOrdersRequest,
  GetOrderRequest,
} from '@common/interfaces/models/order';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyOrdersRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const where: Prisma.OrderViewWhereInput = {
      userId: data?.userId || undefined,
      shopId: data?.shopId || undefined,
      status: data.status,
    };

    if (data.paymentId) {
      where.paymentId = data.paymentId;
    }

    const [totalItems, orders] = await Promise.all([
      this.prismaService.orderView.count({
        where,
      }),
      this.prismaService.orderView.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          shopId: true,
          shopName: true,
          status: true,
          itemTotal: true,
          grandTotal: true,
          firstProductImage: true,
          firstProductName: true,
        },
      }),
    ]);
    return {
      orders,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(data: GetOrderRequest) {
    return this.prismaService.orderView.findUnique({
      where: { id: data.orderId, userId: data.userId },
    });
  }

  create(data: Prisma.OrderViewCreateInput) {
    return this.prismaService.orderView.create({
      data,
    });
  }

  update(data: Prisma.OrderViewUpdateInput) {
    return this.prismaService.orderView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.OrderViewWhereUniqueInput) {
    return this.prismaService.orderView.delete({
      where: { id: data.id as string },
    });
  }
}
