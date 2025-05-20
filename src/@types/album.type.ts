import z from 'zod';

import { albumSchema } from '../schemas/album.schema';

export type AlbumList = z.infer<typeof albumSchema>;
