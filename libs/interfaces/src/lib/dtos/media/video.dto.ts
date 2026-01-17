import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  GetManyVideosRequestSchema,
  GetManyVideosResponseSchema,
  GetVideoRequestSchema,
  GetVideoResponseSchema,
} from '@common/interfaces/models/media';
import { createZodDto } from 'nestjs-zod';

export class GetManyVideosRequestDto extends createZodDto(
  GetManyVideosRequestSchema
) {}

export class GetVideoRequestDto extends createZodDto(GetVideoRequestSchema) {}

// ==============================================================================
export class GetManyVideosResponseDto extends createZodDto(
  ResponseSchema(GetManyVideosResponseSchema)
) {}

export class GetVideoResponseDto extends createZodDto(
  ResponseSchema(GetVideoResponseSchema)
) {}
