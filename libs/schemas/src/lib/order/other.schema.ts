import z from 'zod';

export const ReceiverSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
});

export const TimelineSchema = z.array(
  z.object({
    status: z.string(),
    at: z.date(),
  })
);

export type Receiver = z.infer<typeof ReceiverSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
