import { GetManyConversationsRequest } from '@common/interfaces/models/chat';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/chat';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyConversationsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const where: Prisma.ConversationWhereInput = {
      participantIds: { has: data.userId },
    };

    const [totalItems, conversations] = await Promise.all([
      this.prismaService.conversation.count({
        where,
      }),
      this.prismaService.conversation.findMany({
        where,
        skip,
        take,
        orderBy: { lastMessageAt: 'desc' },
        select: {
          id: true,
          participantIds: true,
          lastMessageId: true,
          lastMessageContent: true,
          lastMessageAt: true,
          lastSenderId: true,
          readStatus: true,
        },
      }),
    ]);
    return {
      conversations,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  create(data: Prisma.ConversationCreateInput) {
    return this.prismaService.conversation.create({
      data,
    });
  }

  update(data: Prisma.ConversationUpdateInput) {
    return this.prismaService.conversation.update({
      where: {
        id: data.id as string,
      },
      data,
    });
  }
}
