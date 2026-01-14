import { ResponseSchema } from '@common/interfaces/models/common/response.model';
import {
  GetUserRequestSchema,
  UpdateUserRequestSchema,
  UserResponseSchema,
} from '@common/interfaces/models/user-access';
import { createZodDto } from 'nestjs-zod';

export class GetUserRequestDto extends createZodDto(GetUserRequestSchema) {}

export class UpdateUserRequestDto extends createZodDto(
  UpdateUserRequestSchema
) {}

export class UserResponseDto extends createZodDto(
  ResponseSchema(UserResponseSchema)
) {}
