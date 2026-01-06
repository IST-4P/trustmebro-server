import {
  CreateAddressRequestSchema,
  DeleteAddressRequestSchema,
  UpdateAddressRequestSchema,
} from '@common/interfaces/models/user-access';
import { createZodDto } from 'nestjs-zod';

export class CreateAddressRequestDto extends createZodDto(
  CreateAddressRequestSchema
) {}

export class UpdateAddressRequestDto extends createZodDto(
  UpdateAddressRequestSchema
) {}

export class DeleteAddressRequestDto extends createZodDto(
  DeleteAddressRequestSchema
) {}
