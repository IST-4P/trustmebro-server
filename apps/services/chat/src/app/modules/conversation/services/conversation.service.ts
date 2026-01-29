import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  ConversationResponse,
  CreateConversationRequest,
  DeleteConversationRequest,
  GetManyConversationsRequest,
  GetManyConversationsResponse,
} from '@common/interfaces/models/chat';
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConversationRepository } from '../repositories/conversation.repository';

@Injectable()
export class ConversationService implements OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,
    private readonly conversationRepository: ConversationRepository
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async list({
    processId,
    ...data
  }: GetManyConversationsRequest): Promise<GetManyConversationsResponse> {
    const conversations = await this.conversationRepository.list(data);
    if (conversations.totalItems === 0) {
      throw new NotFoundException('Error.ConversationsNotFound');
    }

    const participantIds = [
      ...new Set(
        conversations.conversations.flatMap(
          (conversation) => conversation.participantIds
        )
      ),
    ];

    const { users } = await firstValueFrom(
      this.userAccessService.getManyInformationUsers({
        userIds: participantIds,
      })
    );

    const enrichedConversations = conversations.conversations.map(
      (conversation) => {
        const participants = conversation.participantIds.map((id) => {
          const user = users[id];
          return {
            id,
            username: user?.username ?? 'Unknown',
            avatar: user?.avatar ?? '',
          };
        });

        return {
          ...conversation,
          participants,
        };
      }
    );

    return {
      ...conversations,
      conversations: enrichedConversations,
    };
  }

  async create({
    processId,
    ...data
  }: CreateConversationRequest): Promise<ConversationResponse> {
    try {
      const checkParticipantExists = await firstValueFrom(
        this.userAccessService.checkParticipantExists({
          processId,
          participantIds: data.participantIds,
        })
      );

      if (checkParticipantExists.count < 2) {
        throw new BadRequestException('Error.ParticipantNotFound');
      }

      const createdConversation = await this.conversationRepository.create({
        participantIds: data.participantIds.sort(),
      });
      return createdConversation;
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new BadRequestException('Error.ConversationAlreadyExists');
      }
      throw error;
    }
  }

  async delete({
    processId,
    ...data
  }: DeleteConversationRequest): Promise<ConversationResponse> {
    try {
      const deletedConversation = await this.conversationRepository.delete(
        data
      );
      return deletedConversation;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.ConversationNotFound');
      }
      throw error;
    }
  }
}
