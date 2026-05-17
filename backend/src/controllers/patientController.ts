import { Request, Response, NextFunction } from 'express';
import { patientIdParamSchema, PatientIdParams } from '../validators/patientValidator';
import { getPatientDashboard as fetchPatientDashboard } from '../services/patientService';

export async function getPatientDashboard(req: Request<PatientIdParams>, res: Response, next: NextFunction) {
  try {
    const params = patientIdParamSchema.parse(req.params);
    const dashboard = await fetchPatientDashboard(params.patientId);

    return res.status(200).json(dashboard);
  } catch (error) {
    next(error);
  }
}
