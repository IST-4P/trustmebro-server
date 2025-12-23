import { ConversationSchema } from '@common/schemas/chat';
import z from 'zod';
import { PaginationQueryRequestSchema } from '../../common/pagination.model';

export const GetManyConversationsRequestSchema =
  PaginationQueryRequestSchema.extend({
    userId: z.uuid(),
    processId: z.uuid().optional(),
  }).strict();

export const CreateConversationRequestSchema = ConversationSchema.pick({
  participantIds: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export const UpdateConversationRequestSchema = ConversationSchema.pick({
  id: true,
  lastMessageId: true,
  lastMessageContent: true,
  lastMessageAt: true,
  lastSenderId: true,
  readStatus: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export type GetManyConversationsRequest = z.infer<
  typeof GetManyConversationsRequestSchema
>;
export type CreateConversationRequest = z.infer<
  typeof CreateConversationRequestSchema
>;
export type UpdateConversationRequest = z.infer<
  typeof UpdateConversationRequestSchema
>;
