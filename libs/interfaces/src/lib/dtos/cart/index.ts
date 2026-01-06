import {
  AddCartItemRequestSchema,
  DeleteCartItemRequestSchema,
  GetManyCartItemsRequestSchema,
  UpdateCartItemRequestSchema,
} from '@common/interfaces/models/cart';
import { createZodDto } from 'nestjs-zod';

export class AddCartItemRequestDto extends createZodDto(
  AddCartItemRequestSchema
) {}

export class UpdateCartItemRequestDto extends createZodDto(
  UpdateCartItemRequestSchema
) {}

export class DeleteCartItemRequestDto extends createZodDto(
  DeleteCartItemRequestSchema
) {}

export class GetManyCartItemsRequestDto extends createZodDto(
  GetManyCartItemsRequestSchema
) {}
