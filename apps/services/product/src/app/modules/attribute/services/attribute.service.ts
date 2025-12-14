import {
  CreateAttributeRequest,
  DeleteAttributeRequest,
  GetAttributeRequest,
  GetManyAttributesRequest,
  UpdateAttributeRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttributeRepository } from '../repositories/attribute.repository';

@Injectable()
export class AttributeService {
  constructor(private readonly attributeRepository: AttributeRepository) {}

  async list(data: GetManyAttributesRequest) {
    return this.attributeRepository.list(data);
  }

  async findById(data: GetAttributeRequest) {
    const attribute = await this.attributeRepository.findById(data.id);
    if (!attribute) {
      throw new NotFoundException('Error.AttributeNotFound');
    }
    return attribute;
  }

  async create(data: CreateAttributeRequest) {
    return this.attributeRepository.create(data);
  }

  async update(data: UpdateAttributeRequest) {
    const attribute = await this.attributeRepository.findById(data.id);
    if (!attribute) {
      throw new NotFoundException('Error.AttributeNotFound');
    }
    return this.attributeRepository.update(data);
  }

  async delete(data: DeleteAttributeRequest) {
    const attribute = await this.attributeRepository.findById(data.id);
    if (!attribute) {
      throw new NotFoundException('Error.AttributeNotFound');
    }
    return this.attributeRepository.delete(data, false);
  }
}
