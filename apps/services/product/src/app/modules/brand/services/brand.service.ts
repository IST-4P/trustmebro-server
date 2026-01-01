import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  BrandResponse,
  CreateBrandRequest,
  DeleteBrandRequest,
  UpdateBrandRequest,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepository } from '../repositories/brand.repository';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async create({
    processId,
    ...data
  }: CreateBrandRequest): Promise<BrandResponse> {
    try {
      const createdBrand = await this.brandRepository.create(data);
      this.kafkaService.emit(QueueTopics.BRAND.CREATE_BRAND, createdBrand);
      return createdBrand;
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.BrandAlreadyExists');
      }
      throw error;
    }
  }

  async update({
    processId,
    ...data
  }: UpdateBrandRequest): Promise<BrandResponse> {
    try {
      const updatedBrand = await this.brandRepository.update(data);
      this.kafkaService.emit(QueueTopics.BRAND.UPDATE_BRAND, updatedBrand);
      return updatedBrand;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.BrandNotFound');
      }
      throw error;
    }
  }

  async delete(data: DeleteBrandRequest): Promise<BrandResponse> {
    try {
      const deletedBrand = await this.brandRepository.delete(data, false);
      this.kafkaService.emit(QueueTopics.BRAND.DELETE_BRAND, deletedBrand);
      return deletedBrand;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.BrandNotFound');
      }
      throw error;
    }
  }
}
