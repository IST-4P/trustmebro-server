import {
  OrderByEnums,
  ProductStatusEnums,
  SortByEnums,
} from '@common/constants/product.constant';
import {
  AttributesProductSchema,
  ProductSchema,
  SkuSchema,
} from '@common/schemas/product';
import { generateSKUs } from '@common/utils/generate-skus.util';
import z from 'zod';
import { PaginationQueryRequestSchema } from '../../common/pagination.model';

export const GetManyProductsRequestSchema = PaginationQueryRequestSchema.extend(
  {
    name: z.string(),

    brandIds: z.preprocess((value) => {
      if (typeof value === 'string') {
        return value;
      }
      return value;
    }, z.array(z.uuid())),
    categories: z.preprocess((value) => {
      if (typeof value === 'string') {
        return value;
      }
      return value;
    }, z.array(z.uuid())),
    status: ProductStatusEnums,

    minPrice: z.coerce.number().int().positive(),
    maxPrice: z.coerce.number().int().positive(),
    createdById: z.uuid(),
  }
)
  .partial()
  .extend({
    orderBy: OrderByEnums,
    sortBy: SortByEnums,
  });

export const GetProductRequestSchema = z.object({
  id: z.uuid(),
  isHidden: z.boolean().optional(),
});

export const UpsertSKUBodySchema = SkuSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true,
}).strict();

export const CreateProductRequestSchema = ProductSchema.pick({
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true,
  createdById: true,
  shopId: true,
  description: true,
  sizeGuide: true,
})
  .extend({
    categories: z.array(z.uuid()),
    skus: z.array(UpsertSKUBodySchema),
    attributes: AttributesProductSchema,
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    //Kiểm tra xem số lượng SKU có hợp lệ không
    const skuValueArray = generateSKUs(variants);
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        message: `Số lượng SKU không hợp lệ`,
        path: ['skus'],
      });
    }

    // Kiểm tra từng SKU có hợp lệ không
    let wrongSKUIndex = -1;
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value;
      if (!isValid) {
        wrongSKUIndex = index;
      }
      return isValid;
    });
    if (!isValidSKUs) {
      ctx.addIssue({
        code: 'custom',
        message: `Giá trị SKU index ${wrongSKUIndex} không hợp lệ`,
        path: ['skus'],
      });
    }
  });

export type GetManyProductsRequest = z.infer<
  typeof GetManyProductsRequestSchema
>;
export type GetProductRequest = z.infer<typeof GetProductRequestSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductRequestSchema>;
