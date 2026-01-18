import { CreatePromotionRedemptionRequest } from '@common/interfaces/models/promotion';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RedemptionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreatePromotionRedemptionRequest) {
    return this.prismaService.promotionRedemption.create({
      data: {
        ...data,
        usedAt: new Date(),
      },
    });
  }
}
