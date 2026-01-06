import {
  GetManyProductsRequest,
  GetManyProductsResponse,
  GetProductRequest,
  GetProductResponse,
  ProductResponse,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async list({
    processId,
    ...data
  }: GetManyProductsRequest): Promise<GetManyProductsResponse> {
    const products = await this.productRepository.list(data);
    if (products.totalItems === 0) {
      throw new NotFoundException('Error.ProductNotFound');
    }
    return products;
  }

  async findById({
    processId,
    ...data
  }: GetProductRequest): Promise<GetProductResponse> {
    const product = await this.productRepository.findById(data);
    if (!product) {
      throw new NotFoundException('Error.ProductNotFound');
    }
    return product;
  }

  create(data: ProductResponse) {
    return this.productRepository.create(ProductMapper(data));
  }

  update(data: ProductResponse) {
    return this.productRepository.update(ProductMapper(data));
  }

  delete(data: { id: string }) {
    return this.productRepository.delete({ id: data.id });
  }
}
