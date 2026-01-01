import {
  CreateProductRequestSchema,
  GetManyProductsRequestSchema,
  GetManyProductsResponseSchema,
  GetProductRequestSchema,
  GetProductResponseSchema,
} from '@common/interfaces/models/product';
import { createZodDto } from 'nestjs-zod';

export class GetManyProductsRequestDto extends createZodDto(
  GetManyProductsRequestSchema
) {}

export class GetProductRequestDto extends createZodDto(
  GetProductRequestSchema
) {}

export class CreateProductRequestDto extends createZodDto(
  CreateProductRequestSchema
) {}

// export class UpdateProductRequestDto extends createZodDto(
//   UpdateProductRequestSchema
// ) {}

// export class DeleteProductRequestDto extends createZodDto(
//   DeleteProductRequestSchema
// ) {}

//=================================================Response DTOs=================================================

export class GetManyProductsResponseDto extends createZodDto(
  GetManyProductsResponseSchema
) {}

export class GetProductResponseDto extends createZodDto(
  GetProductResponseSchema
) {}
