import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  CreateProductReviewRequestSchema,
  GetManyProductReviewsRequestSchema,
  GetManyProductReviewsResponseSchema,
} from '@common/interfaces/models/review';
import { createZodDto } from 'nestjs-zod';

export class GetManyProductReviewsRequestDto extends createZodDto(
  GetManyProductReviewsRequestSchema.omit({ processId: true })
) {}

export class CreateProductReviewRequestDto extends createZodDto(
  CreateProductReviewRequestSchema.omit({ processId: true })
) {}

// =================================================================================
export class GetManyProductReviewsResponseDto extends createZodDto(
  ResponseSchema(GetManyProductReviewsResponseSchema)
) {}
