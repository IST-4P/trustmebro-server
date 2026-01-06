import { PaymentStatusValues } from '@common/constants/payment.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  CancelOrderRequest,
  CreateOrderRequest,
} from '@common/interfaces/models/order';
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
import { generateCode } from '@common/utils/order-code.util';
import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
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
    const paymentId = uuidv4();

    const mergedData = {
      userId,
      receiver: data.receiver,
      shippingFee: data.shippingFee,
      discount: data.discount,
      paymentMethod: data.paymentMethod,
      paymentId: paymentId,
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

    this.kafkaService.emit(QueueTopics.ORDER.CREATE_PAYMENT_BY_ORDER, {
      id: paymentId,
      processId,
      userId,
      code: generateCode('PAYMENT'),
      orderId: createdOrders.map((order) => order.id),
      method: data.paymentMethod,
      status: PaymentStatusValues.PENDING,
      amount: createdOrders.reduce((sum, order) => sum + order.grandTotal, 0),
    });

    await Promise.all(
      createdOrders.map((order) =>
        this.kafkaService.emit(QueueTopics.ORDER.CREATE_ORDER, {
          items: order.items,
          userId: order.userId,
        })
      )
    );
    return { orders: createdOrders };
  }

  async cancelOrdersByPayment(data: { paymentId: string }) {
    const orders = await this.orderRepository.listCancel({
      paymentId: data.paymentId,
    });

    if (orders.length === 0) {
      throw new NotFoundException('Error.OrdersNotFound');
    }

    const orderIds = orders.map((order) => order.id);
    const userId = orders[0].userId;

    const cancelledOrders = await this.orderRepository.cancel(orderIds, userId);

    await Promise.all(
      cancelledOrders.map((order) =>
        this.kafkaService.emit(QueueTopics.ORDER.CANCEL_ORDER, {
          items: order.items.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            productId: item.productId,
          })),
        })
      )
    );

    return cancelledOrders;
  }

  async cancelOrder({ processId, ...data }: CancelOrderRequest) {
    const orderIds = [data.orderId];
    const userId = data.userId;
    const cancelledOrders = await this.orderRepository.cancel(orderIds, userId);

    await Promise.all(
      cancelledOrders.map((order) =>
        this.kafkaService.emit(QueueTopics.ORDER.CANCEL_ORDER, {
          items: order.items.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            productId: item.productId,
          })),
        })
      )
    );

    return cancelledOrders;
  }
}
