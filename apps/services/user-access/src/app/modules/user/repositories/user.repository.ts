import { GetUserRequest } from '@common/interfaces/models/user-access';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(data: GetUserRequest) {
    const where: Prisma.UserWhereUniqueInput = {
      id: data?.id || undefined,
      email: data?.email || undefined,
      phoneNumber: data?.phoneNumber || undefined,
    };
    return this.prismaService.user.findUnique({
      where,
      include: {
        shop: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
    });
  }

  update(data: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id: data.id as string },
      data,
    });
  }

  async checkParticipantExists(participantIds: string[]) {
    const userCount = await this.prismaService.user.count({
      where: {
        id: {
          in: participantIds,
        },
      },
    });

    const shopCount = await this.prismaService.shop.count({
      where: {
        id: {
          in: participantIds,
        },
      },
    });

    return userCount + shopCount;
  }
}
