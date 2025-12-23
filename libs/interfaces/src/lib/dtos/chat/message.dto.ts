import {
  GetManyMessagesRequestSchema,
  GetManyMessagesResponseSchema,
} from '@common/interfaces/models/chat';
import { createZodDto } from 'nestjs-zod';

export class GetManyMessagesRequestDto extends createZodDto(
  GetManyMessagesRequestSchema
) {}

//=================================================Response DTOs=================================================

export class GetManyMessagesResponseDto extends createZodDto(
  GetManyMessagesResponseSchema
) {}
