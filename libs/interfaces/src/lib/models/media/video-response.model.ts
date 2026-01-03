import { VideoSchema } from '@common/schemas/media';
import z from 'zod';

export const VideoResponseSchema = VideoSchema;

export type VideoResponse = z.infer<typeof VideoResponseSchema>;
