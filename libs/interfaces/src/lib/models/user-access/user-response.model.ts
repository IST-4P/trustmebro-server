import { UserSchema } from '@common/schemas/user-access/user.schema';
import z from 'zod';

export const UserResponseSchema = UserSchema.safeExtend({
  shop: z
    .object({
      id: z.string(),
    })
    .optional(),
});

export const CheckParticipantExistsResponseSchema = z.object({
  count: z.number(),
});

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type CheckParticipantExistsResponse = z.infer<
  typeof CheckParticipantExistsResponseSchema
>;
