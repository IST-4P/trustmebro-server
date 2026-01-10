import { OrderResponse } from '@common/interfaces/models/order';
import { Prisma } from '@prisma-client/query';

export const OrderMapper = (
  data: OrderResponse & { shopName: string }
): Prisma.OrderViewCreateInput => {
  return {
    id: data.id,
    code: data.code,

    userId: data.userId,
    shopId: data.shopId,
    shopName: data.shopName,

    status: data.status,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    paymentId: data.paymentId,

    itemTotal: data.itemTotal,
    shippingFee: data.shippingFee,
    discount: data.discount,
    grandTotal: data.grandTotal,

    receiver: data.receiver,
    receiverName: data.receiver.name,
    receiverPhone: data.receiver.phone,
    receiverAddress: data.receiver.address,

    timeline: data.timeline,

    itemsSnapshot: data.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      skuValue: item.skuValue,
      quantity: item.quantity,
      price: item.price,
    })),

    firstProductName: data.items[0].productName,
    firstProductImage: data.items[0].productImage,

    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
