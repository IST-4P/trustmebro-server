import {
  CreateProductRequest,
  GetManyProductsRequest,
  GetProductRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

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

  async create(data: CreateProductRequest) {
    return this.productRepository.create(data);
  }
}
