import { ProductResponse } from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  // async list(data: GetManyBrandsRequest): Promise<GetManyBrandsResponse> {
  //   const brands = await this.brandRepository.list(data);
  //   if (brands.totalItems === 0) {
  //     throw new NotFoundException('Error.BrandNotFound');
  //   }
  //   return brands;
  // }

  // async findById(data: GetBrandRequest): Promise<GetBrandResponse | null> {
  //   const brand = await this.brandRepository.findById(data.id);
  //   if (!brand) {
  //     throw new NotFoundException('Error.BrandNotFound');
  //   }
  //   return brand;
  // }

  create(data: ProductResponse) {
    return this.productRepository.create(ProductMapper(data));
  }

  update(data: ProductResponse) {
    return this.productRepository.update(ProductMapper(data));
  }

  delete(data: ProductResponse) {
    return this.productRepository.delete({ id: data.id });
  }
}
