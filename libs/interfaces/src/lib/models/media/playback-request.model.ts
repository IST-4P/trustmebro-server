import z from 'zod';

export const GetPlaybackRequestSchema = z.object({
  videoId: z.string(),
  userId: z.uuid(),
  processId: z.uuid().optional(),
});

export type GetPlaybackRequest = z.infer<typeof GetPlaybackRequestSchema>;
