import { PaymentStatusValues } from '@common/constants/payment.constant';
import { CreateOrderRepository } from '@common/interfaces/models/order';
import { generateCode } from '@common/utils/order-code.util';
import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma-client/order';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateOrderRepository) {
    const orders = await this.prismaService.$transaction(async (tx) => {
      return Promise.all(
        data.orders.map((shopOrder) => {
          const itemTotal = shopOrder.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
          return tx.order.create({
            data: {
              code: generateCode('ORDER'),
              userId: data.userId,
              shopId: shopOrder.shopId,
              status: OrderStatus.PENDING,

              itemTotal: itemTotal,

              shippingFee: data.shippingFee,

              grandTotal: itemTotal + data.shippingFee,

              receiver: data.receiver,
              paymentMethod: data.paymentMethod,
              paymentId: data.paymentId,
              paymentStatus: PaymentStatusValues.PENDING,
              timeline: [{ status: OrderStatus.PENDING, at: new Date() }],
              createdById: data.userId,

              items: {
                create: shopOrder.items.map((item) => ({
                  shopId: item.shopId,
                  productId: item.productId,
                  skuId: item.skuId,
                  productName: item.productName,
                  skuValue: item.skuValue,
                  quantity: item.quantity,
                  price: item.price,
                  total: item.price * item.quantity,
                  productImage: item.productImage,
                })),
              },
            },
            include: {
              items: true,
            },
          });
        })
      );
    });
    return orders;
  }

  async cancel(orderIds: string[], userId: string) {
    const orders = await this.prismaService.$transaction(async (tx) => {
      const existingOrders = await tx.order.findMany({
        where: {
          id: { in: orderIds },
          userId: userId,
          status: {
            in: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
          },
          deletedAt: null,
        },
      });

      if (existingOrders.length === 0) {
        throw new Error('No valid orders found to cancel');
      }

      const updatedOrders = await Promise.all(
        existingOrders.map((order) =>
          tx.order.update({
            where: { id: order.id },
            data: {
              status: OrderStatus.CANCELLED,
              timeline: [
                ...(Array.isArray(order.timeline) ? order.timeline : []),
                { status: OrderStatus.CANCELLED, at: new Date() },
              ],
              updatedById: userId,
            },
            include: {
              items: true,
            },
          })
        )
      );

      return updatedOrders;
    });

    return orders;
  }
}
