import { QueueTopics } from '@common/constants/queue.constant';
import { OrderItemResponse } from '@common/interfaces/models/order';
import { GetSKURequest } from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SKURepository } from '../repositories/sku.repository';

@Injectable()
export class SKUService {
  constructor(
    private readonly sKURepository: SKURepository,
    private readonly kafkaService: KafkaService
  ) {}

  async findById(data: GetSKURequest) {
    const sku = await this.sKURepository.findById(data);
    if (!sku) {
      throw new NotFoundException('Error.SKUNotFound');
    }
    return sku;
  }

  async decreaseStock(data: { items: OrderItemResponse[]; userId: string }) {
    try {
      await Promise.all(
        data.items.map(async (item) => {
          await this.sKURepository.decreaseStock({
            productId: item.productId,
            value: item.skuValue,
            quantity: item.quantity,
          });
          this.kafkaService.emit(QueueTopics.PRODUCT.STOCK_RESERVED, {
            productId: item.productId,
            skuId: item.skuId,
            userId: data.userId,
          });
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}
