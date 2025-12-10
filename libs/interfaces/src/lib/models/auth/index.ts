import { UserSchema } from '@common/interfaces/schemas/user.schema';
import z from 'zod';

export const LoginRequestSchema = UserSchema.pick({
  username: true,
  password: true,
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  refreshExpiresIn: z.number(),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const LogoutRequestSchema = RefreshTokenRequestSchema;

export const RefreshTokenResponseSchema = LoginResponseSchema;

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
