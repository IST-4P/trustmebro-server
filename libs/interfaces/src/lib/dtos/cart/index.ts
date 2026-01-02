import {
  AddCartItemRequestSchema,
  GetManyCartItemsRequestSchema,
} from '@common/interfaces/models/cart';
import { createZodDto } from 'nestjs-zod';

export class AddCartItemRequestDto extends createZodDto(
  AddCartItemRequestSchema
) {}

export class GetManyCartItemsRequestDto extends createZodDto(
  GetManyCartItemsRequestSchema
) {}
