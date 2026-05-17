import { Request, Response, NextFunction } from 'express';
import { deviceIdParamSchema } from '../validators/deviceValidator';
import { getTodayScheduleForDevice } from '../services/deviceService';

export async function getDeviceTodaySchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const params = deviceIdParamSchema.parse(req.params);
    const schedule = await getTodayScheduleForDevice(params.deviceId);
    return res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
}
