import { z } from 'zod';

export const OrderStatusValues = {
  CREATING: 'CREATING', // đang tạo đơn
  PENDING: 'PENDING', // chờ xác nhận
  CONFIRMED: 'CONFIRMED', // đã xác nhận, đang chuẩn bị
  SHIPPING: 'SHIPPING', // đang giao
  COMPLETED: 'COMPLETED', // đã giao
  CANCELLED: 'CANCELLED', // đã hủy
  REFUNDED: 'REFUNDED', // đã hoàn tiền
} as const;

export const OrderStatusEnums = z.enum([
  OrderStatusValues.CREATING,
  OrderStatusValues.PENDING,
  OrderStatusValues.CONFIRMED,
  OrderStatusValues.SHIPPING,
  OrderStatusValues.COMPLETED,
  OrderStatusValues.CANCELLED,
  OrderStatusValues.REFUNDED,
]);

export const PaymentMethodValues = {
  COD: 'COD',
  WALLET: 'WALLET',
  ONLINE: 'ONLINE',
} as const;

export const PaymentMethodEnums = z.enum([
  PaymentMethodValues.COD,
  PaymentMethodValues.WALLET,
  PaymentMethodValues.ONLINE,
]);

export type OrderStatus = z.infer<typeof OrderStatusEnums>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnums>;
