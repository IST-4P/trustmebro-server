import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  DeleteVideoRequestSchema,
  GetManyVideosRequestSchema,
  GetManyVideosResponseSchema,
  GetVideoRequestSchema,
  GetVideoResponseSchema,
  UpdateVideoRequestSchema,
} from '@common/interfaces/models/media';
import { createZodDto } from 'nestjs-zod';

export class GetManyVideosRequestDto extends createZodDto(
  GetManyVideosRequestSchema
) {}

export class GetVideoRequestDto extends createZodDto(GetVideoRequestSchema) {}

export class UpdateVideoRequestDto extends createZodDto(
  UpdateVideoRequestSchema.omit({ processId: true })
) {}

export class DeleteVideoRequestDto extends createZodDto(
  DeleteVideoRequestSchema.omit({ processId: true })
) {}

// ==============================================================================
export class GetManyVideosResponseDto extends createZodDto(
  ResponseSchema(GetManyVideosResponseSchema)
) {}

export class GetVideoResponseDto extends createZodDto(
  ResponseSchema(GetVideoResponseSchema)
) {}
