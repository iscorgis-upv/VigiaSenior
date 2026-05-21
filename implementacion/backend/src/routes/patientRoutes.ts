import { Router } from 'express';
import { getPatientDashboard } from '../controllers/patientController';

const router = Router();

router.get('/:patientId/dashboard', getPatientDashboard);

export default router;
