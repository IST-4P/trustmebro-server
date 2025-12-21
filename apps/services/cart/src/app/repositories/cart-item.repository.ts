import {
  AddCartItemRequest,
  GetManyCartItemsRequest,
  GetUniqueCartItemRequest,
} from '@common/interfaces/models/cart';
import { CartShopGroup } from '@common/schemas/cart';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartItemRepository {
  constructor(private readonly prismaService: PrismaService) {}

  //   private async validateSKU({
  //     skuId,
  //     quantity,
  //     userId,
  //     isCreate,
  //   }: {
  //     skuId: number
  //     quantity: number
  //     userId: number
  //     isCreate: boolean
  //   }): Promise<SKUType> {
  //     const [cartItem, sku] = await Promise.all([
  //       this.prismaService.cartItem.findUnique({
  //         where: {
  //           userId_skuId: {
  //             userId,
  //             skuId,
  //           },
  //         },
  //       }),
  //       this.prismaService.sKU.findUnique({
  //         where: {
  //           id: skuId,
  //           deletedAt: null,
  //         },
  //         include: {
  //           product: true,
  //         },
  //       }),
  //     ])

  //     // Kiểm tra tồn tại của SKU
  //     if (!sku) {
  //       throw NotFoundSKUException
  //     }

  //     // Kiểm tra hàng tồn
  //     if (sku.stock < 1 || sku.stock < quantity) {
  //       throw OutOfStockSKUException
  //     }

  //     // Kiểm tra số lượng khi thêm mới hoặc cập nhật
  //     if (isCreate && cartItem && quantity + cartItem.quantity > sku.stock) {
  //       throw InvalidQuantityException
  //     } else if (!isCreate && cartItem && quantity > sku.stock) {
  //       throw InvalidQuantityException
  //     }

  //     // Nếu thêm mới và không có cartItem, bỏ qua kiểm tra cartItem
  //     if (!isCreate && !cartItem) {
  //       throw NotFoundCartItemException
  //     }

  //     const { product } = sku

  //     //Kiểm tra xem sản phẩm bị xoá hay có publish không
  //     if (
  //       product.deletedAt !== null ||
  //       product.publishedAt === null ||
  //       (product.publishedAt !== null && product.publishedAt > new Date())
  //     ) {
  //       throw ProductNotFoundException
  //     }

  //     return sku
  //   }

  async list(data: GetManyCartItemsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    // Lấy cart của user (1 user = 1 cart)
    const cart = await this.prismaService.cart.findUnique({
      where: { userId: data.userId },
    });

    if (!cart) {
      throw new NotFoundException('Error.CartNotFound');
    }

    // Lấy toàn bộ CartItem trong cart, sort mới nhất trước
    const items = await this.prismaService.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 3. Group theo shopId
    const groupMap = new Map<string, CartShopGroup>();

    for (const item of items) {
      const shopId = item.shopId;

      if (!groupMap.has(shopId)) {
        groupMap.set(shopId, {
          shopId,
          cartItems: [],
        });
      }

      groupMap.get(shopId)!.cartItems.push(item);
    }

    const sortedGroups = Array.from(groupMap.values());

    // 4. Pagination trên group (theo shop)
    const totalGroups = sortedGroups.length;
    const pageGroups = sortedGroups.slice(skip, skip + take);

    return {
      data: pageGroups,
      page: data.page,
      limit: data.limit,
      totalItems: totalGroups,
      totalPages: Math.ceil(totalGroups / data.limit),
    };
  }

  findUnique(data: GetUniqueCartItemRequest) {
    return this.prismaService.cartItem.findUnique({
      where: {
        cartId_productId_skuId: {
          cartId: data.cartId,
          productId: data.productId,
          skuId: data.skuId,
        },
      },
    });
  }

  async add(data: AddCartItemRequest) {
    return this.prismaService.$transaction(async (tx) => {
      // Tìm Cart hiện tại của user, nếu chưa có thì tạo
      let cart = await tx.cart.findUnique({
        where: { userId: data.userId },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId: data.userId,
            itemCount: 0,
          },
        });
      }

      const result = await tx.cartItem.upsert({
        where: {
          cartId_productId_skuId: {
            cartId: cart.id,
            productId: data.productId,
            skuId: data.skuId,
          },
        },
        update: {
          quantity: {
            increment: data.quantity,
          },
        },
        create: {
          cartId: cart.id,
          productId: data.productId,
          skuId: data.skuId,
          shopId: data.shopId,
          quantity: data.quantity,
          productName: data.productName,
          skuValue: data.skuValue,
          productImage: data.productImage,
        },
      });

      // Cập nhật lại itemCount của Cart
      const itemCount = await tx.cartItem.count({
        where: { cartId: cart.id },
      });

      const updatedCart = await tx.cart.update({
        where: { id: cart.id },
        data: {
          itemCount,
        },
        select: {
          itemCount: true,
        },
      });

      return {
        cartItem: result,
        cartCount: updatedCart.itemCount,
      };
    });
  }
}
