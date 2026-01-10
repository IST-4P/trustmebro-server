import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  CreateShopRequestSchema,
  GetShopRequestSchema,
  UpdateShopRequestSchema,
} from '@common/interfaces/models/user-access';
import { ShopSchema } from '@common/schemas/user-access';
import { createZodDto } from 'nestjs-zod';

export class GetShopRequestDto extends createZodDto(GetShopRequestSchema) {}

export class CreateShopRequestDto extends createZodDto(
  CreateShopRequestSchema
) {}

export class UpdateShopRequestDto extends createZodDto(
  UpdateShopRequestSchema
) {}

export class GetShopResponseDto extends createZodDto(
  ResponseSchema(ShopSchema)
) {}
