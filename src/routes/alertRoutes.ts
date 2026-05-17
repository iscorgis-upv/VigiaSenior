import { Router } from 'express';
import { getPatientAlerts, resolveAlertById } from '../controllers/alertController';

const router = Router();

router.get('/patients/:patientId/alerts', getPatientAlerts);
router.patch('/alerts/:alertId/resolve', resolveAlertById);

export default router;
