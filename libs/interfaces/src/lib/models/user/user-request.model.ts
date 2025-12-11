import { UserSchema } from '@common/interfaces/schemas/user.schema';
import z from 'zod';

export const CreateUserRequestSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  username: true,
  phoneNumber: true,
  avatar: true,
  gender: true,
  roleId: true,
  roleName: true,
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
