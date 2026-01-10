import { UserSchema } from '@common/schemas/user-access/user.schema';
import z from 'zod';

export const UserResponseSchema = UserSchema;

export const CheckParticipantExistsResponseSchema = z.object({
  count: z.number(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type CheckParticipantExistsResponse = z.infer<
  typeof CheckParticipantExistsResponseSchema
>;
