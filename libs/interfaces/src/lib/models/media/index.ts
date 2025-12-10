import z from 'zod';

export const CreatePresignedUrlRequestSchema = z
  .object({
    filename: z.string(),
  })
  .strict();

export const CreatePresignedUrlResponseSchema = z.object({
  presignedUrl: z.string(),
  url: z.string(),
});

export type CreatePresignedUrlRequest = z.infer<
  typeof CreatePresignedUrlRequestSchema
>;

export type CreatePresignedUrlResponse = z.infer<
  typeof CreatePresignedUrlResponseSchema
>;
