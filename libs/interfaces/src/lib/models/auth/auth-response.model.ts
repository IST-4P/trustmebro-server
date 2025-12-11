import z from 'zod';

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  refreshExpiresIn: z.number(),
});

export const RefreshTokenResponseSchema = LoginResponseSchema;

export const RegisterResponseSchema = z.object({
  userId: z.uuid(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
