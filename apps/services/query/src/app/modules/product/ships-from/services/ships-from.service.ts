import {
  GetManyShipsFromRequest,
  GetManyShipsFromResponse,
  GetShipsFromRequest,
  GetShipsFromResponse,
  ShipsFromResponse,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShipsFromMapper } from '../mappers/ships-from.mapper';
import { ShipsFromRepository } from '../repositories/ships-from.repository';

@Injectable()
export class ShipsFromService {
  constructor(private readonly shipsFromRepository: ShipsFromRepository) {}

  async list(data: GetManyShipsFromRequest): Promise<GetManyShipsFromResponse> {
    const shipsFromList = await this.shipsFromRepository.list(data);
    if (shipsFromList.shipsFromList.length === 0) {
      throw new NotFoundException('Error.ShipsFromNotFound');
    }
    return shipsFromList;
  }

  async findById(
    data: GetShipsFromRequest
  ): Promise<GetShipsFromResponse | null> {
    const shipsFrom = await this.shipsFromRepository.findById(data);
    if (!shipsFrom) {
      throw new NotFoundException('Error.ShipsFromNotFound');
    }
    return shipsFrom;
  }

  create(data: ShipsFromResponse) {
    return this.shipsFromRepository.create(ShipsFromMapper(data));
  }

  update(data: ShipsFromResponse) {
    return this.shipsFromRepository.update(ShipsFromMapper(data));
  }

  delete(data: ShipsFromResponse) {
    return this.shipsFromRepository.delete({ id: data.id });
  }
}
