import {
  CreateBrandRequest,
  DeleteBrandRequest,
  GetBrandRequest,
  GetManyBrandsRequest,
  UpdateBrandRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async list(data: GetManyBrandsRequest) {
    const brands = await this.brandRepository.list(data);
    if (brands.totalItems === 0) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return brands;
  }

  async findById(data: GetBrandRequest) {
    const brand = await this.brandRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return brand;
  }

  async create({ processId, ...data }: CreateBrandRequest) {
    return this.brandRepository.create(data);
  }

  async update(data: UpdateBrandRequest) {
    const brand = await this.brandRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return this.brandRepository.update(data);
  }

  async delete(data: DeleteBrandRequest) {
    const brand = await this.brandRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.BrandNotFound');
    }
    return this.brandRepository.delete(data, false);
  }
}
