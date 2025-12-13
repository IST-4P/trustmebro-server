import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: Prisma.UserWhereUniqueInput['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }
}
