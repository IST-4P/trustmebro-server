import { VideoSchema } from '@common/schemas/media';
import z from 'zod';

export const GetVideoRequestSchema = z.object({
  id: z.uuid(),
  status: VideoSchema.shape.status.optional(),
  processId: z.uuid().optional(),
});

export const CreateVideoRequestSchema = VideoSchema.pick({
  id: true,
  storageBucket: true,
  storageKey: true,
  size: true,
  userId: true,
  filetype: true,
}).extend({
  processId: z.uuid().optional(),
});

export const UpdateVideoRequestSchema = VideoSchema.pick({
  id: true,
  status: true,
  updatedById: true,
}).extend({
  processId: z.uuid().optional(),
});

export const DeleteVideoRequestSchema = VideoSchema.pick({
  id: true,
  deletedById: true,
}).extend({
  processId: z.uuid().optional(),
});

export const ProcessVideoRequestSchema = z.object({
  id: z.string(),
  storageKey: z.string(),
  processId: z.uuid().optional(),
  userId: z.uuid(),
});

export type GetVideoRequest = z.infer<typeof GetVideoRequestSchema>;
export type CreateVideoRequest = z.infer<typeof CreateVideoRequestSchema>;
export type UpdateVideoRequest = z.infer<typeof UpdateVideoRequestSchema>;
export type DeleteVideoRequest = z.infer<typeof DeleteVideoRequestSchema>;
export type ProcessVideoRequest = z.infer<typeof ProcessVideoRequestSchema>;
