import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { patientIdParamSchema } from '../validators/patientValidator';
import { getPatientAlerts as fetchPatientAlerts, resolveAlert as resolveAlertService } from '../services/alertService';

const alertIdParamSchema = z.object({
  alertId: z.string().cuid(),
});

export type PatientAlertsParams = z.infer<typeof patientIdParamSchema>;
export type AlertIdParams = z.infer<typeof alertIdParamSchema>;

export async function getPatientAlerts(req: Request<PatientAlertsParams>, res: Response, next: NextFunction) {
  try {
    const params = patientIdParamSchema.parse(req.params);
    const alerts = await fetchPatientAlerts(params.patientId);
    return res.status(200).json(alerts);
  } catch (error) {
    next(error);
  }
}

export async function resolveAlertById(req: Request<AlertIdParams>, res: Response, next: NextFunction) {
  try {
    const params = alertIdParamSchema.parse(req.params);
    const result = await resolveAlertService(params.alertId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
