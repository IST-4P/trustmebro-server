import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateShipsFromRequest,
  DeleteShipsFromRequest,
  ShipsFromResponse,
  UpdateShipsFromRequest,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShipsFromRepository } from '../repositories/ships-from.repository';

@Injectable()
export class ShipsFromService {
  constructor(
    private readonly shipsFromRepository: ShipsFromRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async create({
    processId,
    ...data
  }: CreateShipsFromRequest): Promise<ShipsFromResponse> {
    try {
      const createdShipsFrom = await this.shipsFromRepository.create(data);
      this.kafkaService.emit(
        QueueTopics.SHIPS_FROM.CREATE_SHIPS_FROM,
        createdShipsFrom
      );
      return createdShipsFrom;
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new ConflictException('Error.ShipsFromAlreadyExists');
      }
      throw error;
    }
  }

  async update({
    processId,
    ...data
  }: UpdateShipsFromRequest): Promise<ShipsFromResponse> {
    try {
      const updatedShipsFrom = await this.shipsFromRepository.update(data);
      this.kafkaService.emit(
        QueueTopics.SHIPS_FROM.UPDATE_SHIPS_FROM,
        updatedShipsFrom
      );
      return updatedShipsFrom;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ShipsFromNotFound');
      }
      throw error;
    }
  }

  async delete({
    processId,
    ...data
  }: DeleteShipsFromRequest): Promise<ShipsFromResponse> {
    try {
      const deletedShipsFrom = await this.shipsFromRepository.delete(
        data,
        false
      );
      this.kafkaService.emit(
        QueueTopics.SHIPS_FROM.DELETE_SHIPS_FROM,
        deletedShipsFrom
      );
      return deletedShipsFrom;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ShipsFromNotFound');
      }
      throw error;
    }
  }
}
