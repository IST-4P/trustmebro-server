import { CreateOrderRequestSchema } from '@common/interfaces/models/order';
import { createZodDto } from 'nestjs-zod';

export class CreateOrderRequestDto extends createZodDto(
  CreateOrderRequestSchema
) {}
