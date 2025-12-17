import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(data: { id?: string; email?: string }): Promise<User | null> {
    const where: Prisma.UserWhereUniqueInput = data.id
      ? { id: data.id }
      : { email: data.email! };
    return this.prismaService.user.findUnique({
      where,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }
}
