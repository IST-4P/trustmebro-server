import { RedisConfiguration } from '@common/configurations/redis.config';
import {
  GetManyShipsFromRequest,
  GetManyShipsFromResponse,
  GetShipsFromRequest,
  GetShipsFromResponse,
  ShipsFromResponse,
} from '@common/interfaces/models/product';
import { generateShipsFromCacheKey } from '@common/utils/cache-key.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ShipsFromMapper } from '../mappers/ships-from.mapper';
import { ShipsFromRepository } from '../repositories/ships-from.repository';

@Injectable()
export class ShipsFromService {
  constructor(
    private readonly shipsFromRepository: ShipsFromRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async list(data: GetManyShipsFromRequest): Promise<GetManyShipsFromResponse> {
    // Check cache
    const cacheKey = generateShipsFromCacheKey();
    const cacheData = await this.cacheManager.get<GetManyShipsFromResponse>(
      cacheKey
    );
    if (cacheData) {
      return cacheData;
    }

    const shipsFromList = await this.shipsFromRepository.list(data);
    if (shipsFromList.length === 0) {
      throw new NotFoundException('Error.ShipsFromNotFound');
    }
    this.cacheManager.set(
      cacheKey,
      { shipsFromList },
      RedisConfiguration.CACHE_SHIPS_FROM_TTL
    );
    return { shipsFromList };
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

  delete(data: { id: string }) {
    return this.shipsFromRepository.delete({ id: data.id });
  }
}
