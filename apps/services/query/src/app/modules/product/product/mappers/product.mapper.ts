import { ProductResponse } from '@common/interfaces/models/product';
import { Prisma } from '@prisma-client/query';

export const ProductMapper = (
  data: ProductResponse
): Prisma.ProductViewCreateInput => {
  const totalStock = data.skus.reduce((acc, sku) => acc + sku.stock, 0);
  return {
    id: data.id,
    name: data.name,
    description: data.description,

    provinceId: data.provinceId,
    districtId: data.districtId,
    wardId: data.wardId,

    brandId: data.brand ? data.brand.id : undefined,
    brandName: data.brand ? data.brand.name : undefined,
    brandLogo: data.brand ? data.brand.logo : undefined,

    categoryIds: data.categories.map((c) => c.id),
    categories: data.categories.map((c) => {
      return {
        id: c.id,
        name: c.name,
        logo: c.logo,
        parentCategoryId: c.parentCategoryId,
      };
    }),

    basePrice: data.basePrice,
    virtualPrice: data.virtualPrice,
    minPrice: Math.min(...data.skus.map((sku) => sku.price)),
    maxPrice: Math.max(...data.skus.map((sku) => sku.price)),

    totalStock: totalStock,
    isAvailable: totalStock > 0,

    images: data.images,
    sizeGuide: data.sizeGuide,

    variants: data.variants,
    attributes: data.attributes,

    skus: data.skus.map((sku) => ({
      id: sku.id,
      value: sku.value,
      price: sku.price,
      stock: sku.stock,
      image: sku.image,
    })),

    reviewIds: data.reviewIds,
    ratingCount: data.ratingCount,
    averageRate: data.averageRate,
    soldCount: data.soldCount,
    viewCount: data.viewCount,
    likeCount: data.likeCount,

    shopId: data.shopId,
    status: data.status,
    isApproved: data.isApproved,
    isHidden: data.isHidden,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
