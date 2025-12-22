import z from 'zod';

export const OrderItemSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  productId: z.uuid(),
  skuId: z.uuid(),
  shopId: z.uuid(),
  productName: z.string(),
  skuValue: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  total: z.number().min(0),
  productImage: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
