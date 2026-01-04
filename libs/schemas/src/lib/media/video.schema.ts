import { VideoStatusEnums } from '@common/constants/media.constant';
import z from 'zod';
import { BaseSchema } from '../common/base.schema';

export const VideoSchema = BaseSchema.extend({
  storageBucket: z.string(),
  storageKey: z.string(),
  size: z.number().int().nonnegative(),
  userId: z.uuid(),
  filetype: z.string(),
  status: VideoStatusEnums,
});
