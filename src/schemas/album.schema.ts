import z from 'zod';

export const albumSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    createdAt: z.string(),
  })
);
