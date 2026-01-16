import {
  DashboardSellerRequest,
  ORDER_SERVICE_NAME,
  ORDER_SERVICE_PACKAGE_NAME,
  OrderServiceClient,
} from '@common/interfaces/proto-types/order';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class DashBoardService implements OnModuleInit {
  private orderService!: OrderServiceClient;
  private productService!: ProductServiceClient;

  constructor(
    @Inject(ORDER_SERVICE_PACKAGE_NAME)
    private orderClient: ClientGrpc,
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async getDashboard(data: DashboardSellerRequest) {
    const orders$ = firstValueFrom(this.orderService.dashboardSeller(data));
    const products$ = firstValueFrom(this.productService.dashboardSeller(data));
    const results = await Promise.all([orders$, products$]);
    return {
      orders: results[0],
      products: results[1],
    };
  }
}
