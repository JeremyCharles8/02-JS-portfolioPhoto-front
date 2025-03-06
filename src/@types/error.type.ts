import z from 'zod';

import { errorSchema } from '../schemas/error.schema';

export type ErrorData = z.infer<typeof errorSchema>;
