import { QueueTopics } from '@common/constants/queue.constant';
import {
  AddCartItemRequest,
  AddCartResponse,
} from '@common/interfaces/models/cart';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
} from '@common/interfaces/proto-types/product';
import { KafkaService } from '@common/kafka/kafka.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CartItemRepository } from '../repositories/cart-item.repository';
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class CartItemService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc,
    private readonly cartRepository: CartRepository,
    private readonly cartItemRepository: CartItemRepository,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  private async validateSKU(data: AddCartItemRequest) {
    let cart = await this.cartRepository.findByUserId({ userId: data.userId });
    if (!cart) {
      cart = await this.cartRepository.create({ userId: data.userId });
    }

    const [cartItem, sku] = await Promise.all([
      this.cartItemRepository.findUnique({
        cartId: cart.id,
        skuId: data.skuId,
        productId: data.productId,
      }),
      firstValueFrom(this.productService.getSku({ id: data.skuId })),
    ]);

    // Kiểm tra tồn tại của SKU
    if (!sku) {
      throw new NotFoundException('Error.SKUNotFound');
    }

    // Kiểm tra hàng tồn
    if (sku.stock < 1 || sku.stock < data.quantity) {
      throw new NotFoundException('Error.SKUOutOfStock');
    }

    // Kiểm tra số lượng khi thêm mới hoặc cập nhật
    if (cartItem && data.quantity + cartItem.quantity > sku.stock) {
      throw new BadRequestException('Error.InvalidQuantity');
    } else if (!cartItem && data.quantity > sku.stock) {
      throw new BadRequestException('Error.InvalidQuantity');
    }

    const { product } = sku;

    //Kiểm tra xem sản phẩm bị xoá hay có publish không
    if (product && product.deletedAt !== null) {
      throw new NotFoundException('Error.ProductNotFound');
    }
  }

  async add({
    processId,
    ...data
  }: AddCartItemRequest): Promise<AddCartResponse> {
    await this.validateSKU(data);
    const addCart = await this.cartItemRepository.add(data);
    this.kafkaService.emit(QueueTopics.CART.ADD_CART, addCart);
    return addCart;
  }
}
