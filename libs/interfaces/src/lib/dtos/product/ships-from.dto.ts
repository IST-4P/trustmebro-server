import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  CreateShipsFromRequestSchema,
  DeleteShipsFromRequestSchema,
  GetManyShipsFromRequestSchema,
  GetManyShipsFromResponseSchema,
  GetShipsFromRequestSchema,
  GetShipsFromResponseSchema,
  UpdateShipsFromRequestSchema,
} from '@common/interfaces/models/product';
import { createZodDto } from 'nestjs-zod';

export class GetManyShipsFromRequestDto extends createZodDto(
  GetManyShipsFromRequestSchema
) {}

export class GetShipsFromRequestDto extends createZodDto(
  GetShipsFromRequestSchema
) {}

export class CreateShipsFromRequestDto extends createZodDto(
  CreateShipsFromRequestSchema
) {}

export class UpdateShipsFromRequestDto extends createZodDto(
  UpdateShipsFromRequestSchema
) {}

export class DeleteShipsFromRequestDto extends createZodDto(
  DeleteShipsFromRequestSchema
) {}

//=================================================Response DTOs=================================================

export class GetManyShipsFromResponseDto extends createZodDto(
  ResponseSchema(GetManyShipsFromResponseSchema)
) {}

export class GetShipsFromResponseDto extends createZodDto(
  ResponseSchema(GetShipsFromResponseSchema)
) {}
