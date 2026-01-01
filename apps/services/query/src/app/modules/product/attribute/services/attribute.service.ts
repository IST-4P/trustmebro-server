import {
  AttributeResponse,
  GetAttributeRequest,
  GetAttributeResponse,
  GetManyAttributesRequest,
  GetManyAttributesResponse,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttributeMapper } from '../mappers/attribute.mapper';
import { AttributeRepository } from '../repositories/attribute.repository';

@Injectable()
export class AttributeService {
  constructor(private readonly attributeRepository: AttributeRepository) {}

  async list(
    data: GetManyAttributesRequest
  ): Promise<GetManyAttributesResponse> {
    const attributes = await this.attributeRepository.list(data);
    if (attributes.totalItems === 0) {
      throw new NotFoundException('Error.AttributeNotFound');
    }
    return attributes;
  }

  async findById(
    data: GetAttributeRequest
  ): Promise<GetAttributeResponse | null> {
    const attribute = await this.attributeRepository.findById(data);
    if (!attribute) {
      throw new NotFoundException('Error.AttributeNotFound');
    }
    return attribute;
  }

  create(data: AttributeResponse) {
    return this.attributeRepository.create(AttributeMapper(data));
  }

  update(data: AttributeResponse) {
    return this.attributeRepository.update(AttributeMapper(data));
  }

  delete(data: AttributeResponse) {
    return this.attributeRepository.delete({ id: data.id });
  }
}
