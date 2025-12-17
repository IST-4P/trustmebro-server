import {
  BrandResponse,
  GetBrandRequest,
  GetBrandResponse,
  GetManyBrandsRequest,
  GetManyBrandsResponse,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandMapper } from '../mappers/brand.mapper';
import { BrandRepository } from '../repositories/brand.repository';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async list(data: GetManyBrandsRequest): Promise<GetManyBrandsResponse> {
    const brands = await this.brandRepository.list(data);
    if (brands.totalItems === 0) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return brands;
  }

  async findById(data: GetBrandRequest): Promise<GetBrandResponse | null> {
    const brand = await this.brandRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return brand;
  }

  create(data: BrandResponse) {
    return this.brandRepository.create(BrandMapper(data));
  }

  update(data: BrandResponse) {
    return this.brandRepository.update(BrandMapper(data));
  }

  delete(data: BrandResponse) {
    return this.brandRepository.delete({ id: data.id });
  }
}
