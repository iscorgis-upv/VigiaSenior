import { z } from 'zod';

export const patientIdParamSchema = z.object({
  patientId: z.string().cuid(),
});

export type PatientIdParams = z.infer<typeof patientIdParamSchema>;
