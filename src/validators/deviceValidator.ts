import { z } from 'zod';

export const deviceIdParamSchema = z.object({
  deviceId: z.string().cuid(),
});

export type DeviceIdParams = z.infer<typeof deviceIdParamSchema>;
