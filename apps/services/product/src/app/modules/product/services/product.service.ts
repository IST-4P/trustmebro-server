import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateProductRequest,
  GetManyProductsRequest,
  GetProductRequest,
  ProductResponse,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async list(data: GetManyProductsRequest) {
    const products = await this.productRepository.list(data);
    if (products.totalItems === 0) {
      throw new NotFoundException('Error.NoProductsFound');
    }
    return products;
  }

  async findById(data: GetProductRequest) {
    const product = await this.productRepository.findById(data);
    if (!product) {
      throw new NotFoundException('Error.ProductNotFound');
    }
    return product;
  }

  async create({
    processId,
    ...data
  }: CreateProductRequest): Promise<ProductResponse> {
    const createdProduct = await this.productRepository.create(data);
    this.kafkaService.emit(QueueTopics.PRODUCT.CREATE_PRODUCT, createdProduct);
    return createdProduct;
  }
}
