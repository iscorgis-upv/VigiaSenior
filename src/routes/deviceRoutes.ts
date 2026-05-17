import { Router } from 'express';
import { getDeviceTodaySchedule } from '../controllers/deviceController';
import { postDeviceEvent } from '../controllers/eventController';

const router = Router();

router.get('/:deviceId/schedule/today', getDeviceTodaySchedule);
router.post('/:deviceId/events', postDeviceEvent);

export default router;
