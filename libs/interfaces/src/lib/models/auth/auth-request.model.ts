import { UserSchema } from '@common/schemas/user';
import z from 'zod';

export const LoginRequestSchema = UserSchema.pick({
  username: true,
}).extend({
  password: z.string(),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const LogoutRequestSchema = RefreshTokenRequestSchema;

export const RegisterRequestSchema = UserSchema.pick({
  username: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  gender: true,
}).extend({
  password: z.string(),
});

export const VerifyTokenRequestSchema = z.object({
  token: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type VerifyTokenRequest = z.infer<typeof VerifyTokenRequestSchema>;
