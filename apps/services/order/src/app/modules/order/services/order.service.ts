import { PaymentStatusValues } from '@common/constants/payment.constant';
import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  CancelOrderRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  DashboardSellerRequest,
  DashboardSellerResponse,
  UpdateStatusOrderRequest,
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
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
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
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc,
    @Inject(CART_SERVICE_PACKAGE_NAME)
    private cartClient: ClientGrpc,
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,
    private readonly orderRepository: OrderRepository,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
    this.cartService =
      this.cartClient.getService<CartServiceClient>(CART_SERVICE_NAME);
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async create({
    processId,
    userId,
    ...data
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const cartItemIds = data.orders.map((item) => item.cartItemIds).flat();
    const cartItems = await firstValueFrom(
      this.cartService.validateCartItems({
        processId,
        cartItemIds: cartItemIds,
        userId,
      })
    );

    // Check shopId có đúng k
    const shop = await firstValueFrom(
      this.userAccessService.validateShops({
        processId,
        shopIds: data.orders.map((order) => order.shopId),
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
          order: {
            ...order,
            shopName: shop.shops.find((s) => s.id === order.shopId)?.name || '',
          },
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
          orderId: order.id,
        })
      )
    );

    return cancelledOrders;
  }

  async cancelOrder({ processId, ...data }: CancelOrderRequest) {
    const orderIds = [data.orderId];
    const userId = data.userId || undefined;
    const shopId = data.shopId || undefined;
    const cancelledOrders = await this.orderRepository.cancel(
      orderIds,
      userId,
      shopId
    );

    await Promise.all(
      cancelledOrders.map((order) =>
        this.kafkaService.emit(QueueTopics.ORDER.CANCEL_ORDER, {
          items: order.items.map((item) => ({
            skuId: item.skuId,
            quantity: item.quantity,
            productId: item.productId,
          })),
          orderId: order.id,
        })
      )
    );

    return cancelledOrders;
  }

  async paid(data: { paymentId: string }) {
    try {
      const orders = await this.orderRepository.paid(data);
      await Promise.all(
        orders.map((order) =>
          this.kafkaService.emit(QueueTopics.ORDER.UPDATE_ORDER, order)
        )
      );
      return orders;
    } catch (error) {
      throw error;
    }
  }

  async updateStatus({ processId, ...data }: UpdateStatusOrderRequest) {
    try {
      const order = await this.orderRepository.updateStatus(data);
      this.kafkaService.emit(QueueTopics.ORDER.UPDATE_ORDER, order);
      return order;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.OrderNotFound');
      }
      throw error;
    }
  }

  async dashboardSeller(
    data: DashboardSellerRequest
  ): Promise<DashboardSellerResponse> {
    return this.orderRepository.dashboardSeller(data);
  }
}
