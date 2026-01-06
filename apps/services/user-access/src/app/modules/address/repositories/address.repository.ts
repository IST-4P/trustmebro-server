import { CreateAddressRequest } from '@common/interfaces/models/user-access';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AddressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ userId, ...data }: CreateAddressRequest) {
    return this.prismaService.address.create({
      data: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  update(data: Prisma.AddressUpdateInput) {
    return this.prismaService.address.update({
      where: {
        id: data.id as string,
        updatedAt: new Date(),
      },
      data,
    });
  }

  delete(data: Prisma.AddressWhereInput) {
    return this.prismaService.address.delete({
      where: {
        id: data.id as string,
      },
    });
  }
}
