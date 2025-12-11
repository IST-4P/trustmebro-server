import { UserSchema } from '@common/interfaces/schemas/user.schema';
import z from 'zod';

export const UserResponseSchema = UserSchema;

export type UserResponse = z.infer<typeof UserResponseSchema>;
