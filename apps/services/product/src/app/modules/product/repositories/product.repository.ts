import {
  ProductStatusValues,
  SortByValues,
} from '@common/constants/product.constant';
import {
  CreateProductRequest,
  GetManyProductsRequest,
  GetManyProductsResponse,
  GetProductRequest,
  ValidateItemResult,
  ValidateProductsRequest,
} from '@common/interfaces/models/product';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

interface AttributeInputItem {
  name: string;
  value: string;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateAttributes(attributes: AttributeInputItem[]) {
    if (!attributes || attributes.length === 0) {
      return;
    }

    const inputNames = attributes.map((attr) => attr.name);

    const uniqueInputNames = [...new Set(inputNames)];

    if (uniqueInputNames.length !== inputNames.length) {
      throw new BadRequestException('Danh sách thuộc tính bị trùng lặp tên.');
    }

    const existingAttributes = await this.prismaService.attribute.findMany({
      where: {
        name: { in: uniqueInputNames },
        deletedAt: null,
      },
      select: { name: true },
    });

    if (existingAttributes.length !== uniqueInputNames.length) {
      const foundNamesSet = new Set(existingAttributes.map((a) => a.name));
      const missingAttributes = uniqueInputNames.filter(
        (name) => !foundNamesSet.has(name)
      );

      throw new BadRequestException(
        `Các thuộc tính sau không tồn tại trong hệ thống: ${missingAttributes.join(
          ', '
        )}`
      );
    }
  }

  async list(data: GetManyProductsRequest): Promise<GetManyProductsResponse> {
    const skip = Number((data.page - 1) * data.limit);
    const take = Number(data.limit);
    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: data.status ? data.status : ProductStatusValues.ACTIVE,
      createdById: data.createdById ? data.createdById : undefined,
    };

    if (data.name) {
      where.name = {
        contains: data.name,
        mode: 'insensitive',
      };
    }

    if (data.brandIds && data.brandIds.length > 0) {
      where.brandId = {
        in: data.brandIds,
      };
    }

    if (data.categories && data.categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: data.categories,
          },
        },
      };
    }

    if (data.minPrice !== undefined || data.maxPrice !== undefined) {
      where.virtualPrice = {
        gte: data.minPrice,
        lte: data.maxPrice,
      };
    }
    // Mắc định sort theo createdAt mới nhất
    let calculatedOrderBy:
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: data.orderBy,
    };

    if (data.sortBy === SortByValues.Price) {
      calculatedOrderBy = {
        basePrice: data.orderBy,
      };
    } else if (data.sortBy === SortByValues.Sale) {
      calculatedOrderBy = {
        soldCount: data.orderBy,
      };
    }

    const [totalItems, products] = await Promise.all([
      this.prismaService.product.count({
        where,
      }),
      this.prismaService.product.findMany({
        where,
        orderBy: calculatedOrderBy,
        skip,
        take,
        select: {
          name: true,
          basePrice: true,
          virtualPrice: true,
          images: true,
          status: true,
          averageRate: true,
          soldCount: true,
        },
      }),
    ]);
    return {
      products,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(data: GetProductRequest) {
    let where: Prisma.ProductWhereUniqueInput = {
      id: data.id,
      deletedAt: null,
    };

    if (data.isHidden !== undefined) {
      where.isHidden = data.isHidden;
    }
    return this.prismaService.product.findUnique({
      where,
      include: {
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            parentCategory: true,
          },
        },
      },
    });
  }

  async create(data: CreateProductRequest) {
    await this.validateAttributes(data.attributes);
    const { skus, categories, brandId, shipsFromId, ...productData } = data;
    return this.prismaService.product.create({
      data: {
        ...productData,
        createdById: data.createdById,
        brand: {
          connect: { id: brandId },
        },
        shipsFrom: {
          connect: { id: shipsFromId },
        },
        categories: {
          connect: categories.map((category) => ({ id: category })),
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById: data.createdById,
            })),
          },
        },
      },
      include: {
        skus: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            value: true,
            price: true,
            stock: true,
            image: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            logo: true,
            parentCategory: true,
          },
        },
        shipsFrom: {
          select: {
            id: true,
            address: true,
          },
        },
      },
    });
  }

  async validateProducts(data: ValidateProductsRequest) {
    const results: ValidateItemResult[] = [];

    const skuIds = data.productIds.map((item) => item.skuId);
    const skus = await this.prismaService.sKU.findMany({
      where: {
        id: { in: skuIds },
      },
      include: {
        product: true,
      },
    });

    const skuMap = new Map(skus.map((s) => [s.id, s]));
    const cartItemMap = new Map(
      data.productIds.map((item) => [item.skuId, item.cartItemId])
    );

    for (const req of data.productIds) {
      const sku = skuMap.get(req.skuId);
      const cartItemId = cartItemMap.get(req.skuId);

      // Check 1: SKU không tồn tại
      if (!sku) {
        results.push({
          productId: req.productId,
          skuId: req.skuId,
          cartItemId,
          isValid: false,
          quantity: req.quantity,
          price: 0,
          productName: '',
          productImage: '',
          skuValue: '',
          shopId: '',
          error: 'SKU_NOT_FOUND',
        });
        continue;
      }

      // Check 2: Product ID không khớp
      if (sku.productId !== req.productId) {
        results.push({
          productId: req.productId,
          skuId: req.skuId,
          cartItemId,
          isValid: false,
          quantity: req.quantity,
          price: 0,
          productName: '',
          productImage: '',
          skuValue: '',
          shopId: '',
          error: 'PRODUCT_ID_MISMATCH',
        });
        continue;
      }

      const product = sku.product;

      // Check 3: Trạng thái Product (Active/Inactive/Draft)
      if (product.status !== ProductStatusValues.ACTIVE) {
        results.push({
          productId: product.id,
          skuId: sku.id,
          cartItemId,
          isValid: false,
          quantity: req.quantity,
          price: sku.price,
          productName: product.name,
          productImage: sku.image,
          skuValue: sku.value,
          shopId: product.shopId,
          error: `PRODUCT_STATUS_${product.status}`,
        });
        continue;
      }

      // Check 4: Product bị xóa

      if (product.deletedAt !== null) {
        results.push({
          productId: product.id,
          skuId: sku.id,
          cartItemId,
          isValid: false,
          quantity: req.quantity,
          price: sku.price,
          productName: product.name,
          productImage: sku.image,
          skuValue: sku.value,
          shopId: product.shopId,
          error: 'PRODUCT_UNAVAILABLE',
        });
        continue;
      }

      // Check 5: Tồn kho (Stock)
      if (sku.stock < req.quantity) {
        results.push({
          productId: product.id,
          skuId: sku.id,
          cartItemId,
          isValid: false,
          quantity: req.quantity,
          price: sku.price,
          productName: product.name,
          productImage: sku.image,
          skuValue: sku.value,
          shopId: product.shopId,
          error: 'OUT_OF_STOCK',
        });
        continue;
      }

      // Validated OK
      results.push({
        productId: product.id,
        skuId: sku.id,
        cartItemId,
        isValid: true,
        quantity: req.quantity,
        price: sku.price, // Order Service sẽ dùng giá này để tính total
        productName: product.name,
        productImage: sku.image,
        skuValue: sku.value,
        shopId: product.shopId, // Order Service sẽ dùng cái này để group đơn
      });
    }

    // Kết quả chung cuộc: Valid khi và chỉ khi TẤT CẢ items đều valid
    const isAllValid = results.every((r) => r.isValid);

    return {
      isValid: isAllValid,
      items: results,
    };
  }
}
