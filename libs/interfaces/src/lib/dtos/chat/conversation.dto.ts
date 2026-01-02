import {
  CreateConversationRequestSchema,
  GetManyConversationsRequestSchema,
} from '@common/interfaces/models/chat';
import { createZodDto } from 'nestjs-zod';

export class CreateConversationRequestDto extends createZodDto(
  CreateConversationRequestSchema
) {}

export class GetManyConversationsRequestDto extends createZodDto(
  GetManyConversationsRequestSchema
) {}

//=================================================Response DTOs=================================================
