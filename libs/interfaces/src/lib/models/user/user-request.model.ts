import { UserSchema } from '@common/schemas/user/user.schema';
import z from 'zod';

export const CreateUserRequestSchema = UserSchema.pick({
  id: true,
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
