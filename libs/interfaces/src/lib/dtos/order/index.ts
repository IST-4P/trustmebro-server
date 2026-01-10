import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  CreateOrderRequestSchema,
  CreateOrderResponseSchema,
  GetManyOrdersRequestSchema,
  GetManyOrdersResponseSchema,
  GetOrderRequestSchema,
  GetOrderResponseSchema,
} from '@common/interfaces/models/order';
import { createZodDto } from 'nestjs-zod';

export class GetManyOrdersRequestDto extends createZodDto(
  GetManyOrdersRequestSchema
) {}

export class GetOrderRequestDto extends createZodDto(GetOrderRequestSchema) {}

export class CreateOrderRequestDto extends createZodDto(
  CreateOrderRequestSchema
) {}

//=================================================================================================
export class CreateOrderResponseDto extends createZodDto(
  ResponseSchema(CreateOrderResponseSchema)
) {}

export class GetManyOrdersResponseDto extends createZodDto(
  ResponseSchema(GetManyOrdersResponseSchema)
) {}

export class GetOrderResponseDto extends createZodDto(
  ResponseSchema(GetOrderResponseSchema)
) {}
