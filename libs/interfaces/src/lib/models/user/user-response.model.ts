import { UserSchema } from '@common/schemas/user/user.schema';
import z from 'zod';

export const UserResponseSchema = UserSchema;

export type UserResponse = z.infer<typeof UserResponseSchema>;
