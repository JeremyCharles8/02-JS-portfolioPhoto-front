import z from 'zod';

import { metaDataSchema } from '../schemas/photo.shcema';

export type MetaData = z.infer<typeof metaDataSchema>;
