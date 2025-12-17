import { QueueTopics } from '@common/constants/queue.constant';
import {
  AttributeResponse,
  CreateAttributeRequest,
  DeleteAttributeRequest,
  UpdateAttributeRequest,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttributeRepository } from '../repositories/attribute.repository';

@Injectable()
export class AttributeService {
  constructor(
    private readonly attributeRepository: AttributeRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async create({
    processId,
    ...data
  }: CreateAttributeRequest): Promise<AttributeResponse> {
    const createdAttribute = await this.attributeRepository.create(data);
    this.kafkaService.emit(
      QueueTopics.ATTRIBUTE.CREATE_ATTRIBUTE,
      createdAttribute
    );
    return createdAttribute;
  }

  async update({
    processId,
    ...data
  }: UpdateAttributeRequest): Promise<AttributeResponse> {
    try {
      const updatedAttribute = await this.attributeRepository.update(data);
      this.kafkaService.emit(
        QueueTopics.ATTRIBUTE.UPDATE_ATTRIBUTE,
        updatedAttribute
      );
      return updatedAttribute;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.AttributeNotFound');
      }
      throw error;
    }
  }

  async delete({
    processId,
    ...data
  }: DeleteAttributeRequest): Promise<AttributeResponse> {
    try {
      const deletedAttribute = await this.attributeRepository.delete(
        data,
        false
      );
      this.kafkaService.emit(
        QueueTopics.ATTRIBUTE.DELETE_ATTRIBUTE,
        deletedAttribute
      );
      return deletedAttribute;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.AttributeNotFound');
      }
      throw error;
    }
  }
}
