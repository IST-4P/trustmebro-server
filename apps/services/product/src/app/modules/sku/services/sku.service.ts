import { GetSKURequest } from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SKURepository } from '../repositories/sku.repository';

@Injectable()
export class SKUService {
  constructor(private readonly sKURepository: SKURepository) {}

  async findById(data: GetSKURequest) {
    const sku = await this.sKURepository.findById(data);
    if (!sku) {
      throw new NotFoundException('Error.SKUNotFound');
    }
    return sku;
  }
}
