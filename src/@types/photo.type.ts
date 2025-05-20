import z from 'zod';

import { metaDataSchema } from '../schemas/photo.schema';

export type MetaData = z.infer<typeof metaDataSchema>;

export type AddPhoto = {
  title: string;
  caption: string;
  file: null;
};
