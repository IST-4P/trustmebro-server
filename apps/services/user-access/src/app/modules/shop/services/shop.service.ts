import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  CreateShopRequest,
  GetShopRequest,
  ShopResponse,
  UpdateShopRequest,
  ValidateShopsRequest,
  ValidateShopsResponse,
} from '@common/interfaces/models/user-access';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../repositories/shop.repository';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async find(data: GetShopRequest): Promise<ShopResponse> {
    const shop = await this.shopRepository.find(data);
    if (!shop) {
      throw new NotFoundException('Error.ShopNotFound');
    }
    console.log(shop);
    return shop;
  }

  async create({
    processId,
    ...data
  }: CreateShopRequest): Promise<ShopResponse> {
    return this.shopRepository.create(data);
  }

  async update({
    processId,
    ...data
  }: UpdateShopRequest): Promise<ShopResponse> {
    try {
      const shop = await this.shopRepository.update(data);
      return shop;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ShopNotFound');
      }

      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.ShopAlreadyExists');
      }

      throw error;
    }
  }

  async validateShops({
    processId,
    ...data
  }: ValidateShopsRequest): Promise<ValidateShopsResponse> {
    const shops = await this.shopRepository.validateShops(data);
    if (shops.length !== data.shopIds.length) {
      throw new NotFoundException('Error.SomeShopsNotFound');
    }
    return { shops };
  }
}
