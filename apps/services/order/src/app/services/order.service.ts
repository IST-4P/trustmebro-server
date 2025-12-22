import { QueueTopics } from '@common/constants/queue.constant';
import { CreateOrderRequest } from '@common/interfaces/models/order';
import {
  CART_SERVICE_NAME,
  CART_SERVICE_PACKAGE_NAME,
  CartServiceClient,
} from '@common/interfaces/proto-types/cart';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
} from '@common/interfaces/proto-types/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService!: ProductServiceClient;
  private cartService!: CartServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc,
    @Inject(CART_SERVICE_PACKAGE_NAME)
    private cartClient: ClientGrpc,
    private readonly orderRepository: OrderRepository,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
    this.cartService =
      this.cartClient.getService<CartServiceClient>(CART_SERVICE_NAME);
  }

  async create({ processId, userId, ...data }: CreateOrderRequest) {
    const cartItemIds = data.orders.map((item) => item.cartItemIds).flat();
    const cartItems = await firstValueFrom(
      this.cartService.validateCartItems({
        processId,
        cartItemIds: cartItemIds,
        userId,
      })
    );

    const productIds = cartItems.cartItems.map((item) => {
      return {
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity,
        cartItemId: item.id,
      };
    });

    const productsResult = await firstValueFrom(
      this.productService.validateProducts({
        processId,
        productIds,
      })
    );

    if (productsResult.isValid === false) {
      throw new Error('Some products are invalid or out of stock');
    }

    const mergedData = {
      userId,
      receiver: data.receiver,
      shippingFee: data.shippingFee,
      paymentMethod: data.paymentMethod,
      orders: data.orders.map((order) => ({
        shopId: order.shopId,
        items: productsResult.items.filter(
          (item) =>
            item.shopId === order.shopId &&
            order.cartItemIds.includes(item.cartItemId)
        ),
      })),
    };
    const createdOrders = await this.orderRepository.create(mergedData);
    await Promise.all(
      createdOrders.map((order) =>
        this.kafkaService.emit(QueueTopics.ORDER.CREATE_ORDER, {
          items: order.items,
          userId: order.userId,
        })
      )
    );
    return createdOrders;
  }
}
