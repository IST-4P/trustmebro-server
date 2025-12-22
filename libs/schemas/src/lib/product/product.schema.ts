import { ProductStatusEnums } from '@common/constants/product.constant';
import { z } from 'zod';
import { BaseSchema } from '../common/base.schema';
import { VariantsProductSchema } from './other.schema';

export const ProductSchema = BaseSchema.extend({
  name: z.string(),
  description: z.string(),
  shipsFromId: z.uuid(),
  sizeGuide: z.string().optional(),
  basePrice: z.number().default(0),
  virtualPrice: z.number().default(0),
  status: ProductStatusEnums,
  brandId: z.uuid(),
  images: z.array(z.string()),
  variants: VariantsProductSchema,
  reviewIds: z.array(z.string()),
  shopId: z.string(),
  likeCount: z.number().int().default(0),
  ratingCount: z.number().int().default(0),
  ratingSum: z.number().int().default(0),
  averageRate: z.number().default(0),
  attributes: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
  soldCount: z.number().int().default(0),
  viewCount: z.number().int().default(0),
  isApproved: z.boolean().default(false),
  isHidden: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductSchema>;
