import { VerificationCodeEnums } from '@common/constants/user.constant';
import z from 'zod';

export const VerificationCodeSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  code: z.string().length(6),
  type: VerificationCodeEnums,
  expiresAt: z.date(),
  createdAt: z.date(),
});
