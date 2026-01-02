import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(data: { id?: string; email?: string }) {
    const where: Prisma.UserWhereUniqueInput = data.id
      ? { id: data.id }
      : { email: data.email! };
    return this.prismaService.user.findUnique({
      where,
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

  checkParticipantExists(participantIds: string[]) {
    return this.prismaService.user.count({
      where: {
        id: {
          in: participantIds,
        },
      },
    });
  }
}
