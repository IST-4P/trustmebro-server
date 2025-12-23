import {
  CreateMessageRequest,
  GetManyMessagesRequest,
} from '@common/interfaces/models/chat';
import { ReadStatus } from '@common/schemas/chat';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma-client/chat';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyMessagesRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const conversation = await this.prismaService.conversation.findUnique({
      where: {
        id: data.conversationId,
        participantIds: { has: data.senderId },
      },
      select: { id: true },
    });

    const where: Prisma.MessageWhereInput = {
      conversationId: conversation.id,
    };

    const [totalItems, messages] = await Promise.all([
      this.prismaService.message.count({
        where,
      }),
      this.prismaService.message.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          conversationId: true,
          senderId: true,
          content: true,
          type: true,
          metadata: true,
          createdAt: true,
        },
      }),
    ]);
    return {
      messages,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  create(data: CreateMessageRequest) {
    return this.prismaService.$transaction(async (tx) => {
      // 1. Lấy conversation hiện tại
      const conversation = await tx.conversation.findUnique({
        where: { id: data.conversationId },
      });

      if (!conversation) {
        throw new NotFoundException('Error.ConversationNotFound');
      }

      // 2. Tạo message
      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: data.senderId,
          content: data.content,
          type: data.type,
          metadata: data.metadata,
        },
      });

      // 3. Cập nhật Conversation (lastMessage + readStatus)
      const readStatus = (conversation.readStatus as ReadStatus | null) ?? {};

      // Conversation theo thiết kế luôn có 2 participantIds
      const [userA, userB] = conversation.participantIds;
      const receiverId = data.senderId === userA ? userB : userA;

      const prevSenderStatus = readStatus[data.senderId] ?? {
        isRead: true,
        lastSeenMessageId: null,
        deletedAt: null,
      };

      const prevReceiverStatus = readStatus[receiverId] ?? {
        isRead: true,
        lastSeenMessageId: null,
        deletedAt: null,
      };

      readStatus[data.senderId] = {
        ...prevSenderStatus,
        isRead: true,
        lastSeenMessageId: message.id,
      };

      readStatus[receiverId] = {
        ...prevReceiverStatus,
        isRead: false, // receiver chưa đọc tin mới
      };

      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageId: message.id,
          lastMessageContent: data.content,
          lastMessageAt: message.createdAt,
          lastSenderId: data.senderId,
          readStatus,
        },
      });

      return { participantIds: conversation.participantIds, message };
    });
  }
}
