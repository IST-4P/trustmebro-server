import { OrderStatusValues } from '@common/constants/order.constant';
import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  GetManyOrdersRequest,
  GetManyOrdersResponse,
  GetOrderRequest,
  GetOrderResponse,
  OrderResponse,
} from '@common/interfaces/models/order';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async list(data: GetManyOrdersRequest): Promise<GetManyOrdersResponse> {
    const orders = await this.orderRepository.list(data);
    if (orders.totalItems === 0) {
      throw new NotFoundException('Error.OrdersNotFound');
    }
    return orders;
  }

  async findById(data: GetOrderRequest): Promise<GetOrderResponse> {
    try {
      const order = await this.orderRepository.findById(data);
      return order;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.OrderNotFound');
      }
      throw error;
    }
  }

  create(data: OrderResponse & { shopName: string }) {
    return this.orderRepository.create(OrderMapper(data));
  }

  cancel(data: { orderId: string }) {
    return this.orderRepository.update({
      id: data.orderId,
      status: OrderStatusValues.CANCELLED,
    });
  }

  update(data: OrderResponse) {
    return this.orderRepository.update(OrderMapper(data));
  }
}
