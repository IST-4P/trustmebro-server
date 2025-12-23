import { ReadStatus as ReadStatusType } from '@common/schemas/chat';

declare global {
  namespace PrismaJson {
    type ConversationReadStatus = ReadStatusType;
  }
}
