import z from 'zod';

export const metaDataSchema = z.array(
  z.object({
    id: z.number(),
    fileName: z.string(),
    title: z.string(),
    caption: z.string(),
    albumId: z.number(),
    album: z.string(),
    createdAt: z.string(),
  })
);
