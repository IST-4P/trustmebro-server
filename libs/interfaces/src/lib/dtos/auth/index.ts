import {
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutRequestSchema,
  RefreshTokenRequestSchema,
  RefreshTokenResponseSchema,
} from '@common/interfaces/models/auth';
import { createZodDto } from 'nestjs-zod';

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}

export class RefreshTokenRequestDto extends createZodDto(
  RefreshTokenRequestSchema
) {}

export class RefreshTokenResponseDto extends createZodDto(
  RefreshTokenResponseSchema
) {}

export class LogoutRequestDto extends createZodDto(LogoutRequestSchema) {}
