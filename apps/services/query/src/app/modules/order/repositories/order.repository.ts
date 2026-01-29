import { OrderStatusValues } from '@common/constants/order.constant';
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
          code: true,
          shopId: true,
          shopName: true,
          status: true,
          itemTotal: true,
          grandTotal: true,
          firstProductImage: true,
          firstProductName: true,
          createdAt: true,
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

  async dashboard() {
    const orders$ = this.prismaService.orderView.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const totalRevenue$ = this.prismaService.orderView.aggregate({
      _sum: {
        grandTotal: true,
      },
    });

    const totalItems$ = this.prismaService.orderView.count();

    const [orders, totalRevenue, totalItems] = await Promise.all([
      orders$,
      totalRevenue$,
      totalItems$,
    ]);

    return {
      orderComplete:
        orders.find((order) => order.status === OrderStatusValues.COMPLETED)
          ?._count.id || 0,
      orderPending:
        orders.find((order) => order.status === OrderStatusValues.PENDING)
          ?._count.id || 0,
      orderCancelled:
        orders.find((order) => order.status === OrderStatusValues.CANCELLED)
          ?._count.id || 0,
      orderConfirmed:
        orders.find((order) => order.status === OrderStatusValues.CONFIRMED)
          ?._count.id || 0,
      orderShipping:
        orders.find((order) => order.status === OrderStatusValues.SHIPPING)
          ?._count.id || 0,
      totalRevenue: totalRevenue._sum.grandTotal,
      totalOrders: totalItems,
    };
  }
}
