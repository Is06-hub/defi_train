// backend/src/modules/session/session.schema.ts
import { z } from 'zod';
import { CreateSessionSchema } from '../../schemas/painSession.schema';

export { CreateSessionSchema };

export const SessionIdParamSchema = z.object({
  id: z.string().min(1, 'معرف الجلسة مطلوب')
});
