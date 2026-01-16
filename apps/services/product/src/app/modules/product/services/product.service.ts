import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import { DashboardSellerRequest } from '@common/interfaces/models/order';
import {
  CreateProductRequest,
  DeleteProductRequest,
  ProductResponse,
  UpdateProductRequest,
  ValidateProductsRequest,
  ValidateProductsResponse,
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

  // async list(data: GetManyProductsRequest) {
  //   const products = await this.productRepository.list(data);
  //   if (products.totalItems === 0) {
  //     throw new NotFoundException('Error.NoProductsFound');
  //   }
  //   return products;
  // }

  // async findById(data: GetProductRequest) {
  //   const product = await this.productRepository.findById(data);
  //   if (!product) {
  //     throw new NotFoundException('Error.ProductNotFound');
  //   }
  //   return product;
  // }

  async create({
    processId,
    ...data
  }: CreateProductRequest): Promise<ProductResponse> {
    const createdProduct = await this.productRepository.create(data);
    this.kafkaService.emit(QueueTopics.PRODUCT.CREATE_PRODUCT, createdProduct);
    return createdProduct;
  }

  async update({
    processId,
    ...data
  }: UpdateProductRequest): Promise<ProductResponse> {
    try {
      const updatedProduct = await this.productRepository.update(data);
      this.kafkaService.emit(
        QueueTopics.PRODUCT.UPDATE_PRODUCT,
        updatedProduct
      );
      return updatedProduct;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ProductNotFound');
      }
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.ProductAlreadyExists');
      }
      throw error;
    }
  }

  async delete({ processId, ...data }: DeleteProductRequest) {
    try {
      const deletedProduct = await this.productRepository.delete(data, false);
      this.kafkaService.emit(QueueTopics.PRODUCT.DELETE_PRODUCT, {
        id: deletedProduct.id,
      });
      return deletedProduct;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ProductNotFound');
      }
      throw error;
    }
  }

  async validateProducts(
    data: ValidateProductsRequest
  ): Promise<ValidateProductsResponse> {
    return this.productRepository.validateProducts(data);
  }

  async dashboardSeller(data: DashboardSellerRequest) {
    return this.productRepository.dashboardSeller(data);
  }
}
