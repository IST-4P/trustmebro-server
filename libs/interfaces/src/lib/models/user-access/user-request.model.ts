import { UserSchema } from '@common/schemas/user-access/user.schema';
import z from 'zod';

export const GetUserRequestSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    phoneNumber: z.string(),
  })
  .partial();

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

export const UpdateUserRequestSchema = UserSchema.pick({
  firstName: true,
  lastName: true,
  phoneNumber: true,
  avatar: true,
  gender: true,
  birthday: true,
})
  .partial()
  .extend({
    id: z.uuid(),
  })
  .strict();

export const CheckParticipantExistsRequestSchema = z.object({
  processId: z.uuid().optional(),
  participantIds: z.array(z.uuid()),
});

export type GetUserRequest = z.infer<typeof GetUserRequestSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CheckParticipantExistsRequest = z.infer<
  typeof CheckParticipantExistsRequestSchema
>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
