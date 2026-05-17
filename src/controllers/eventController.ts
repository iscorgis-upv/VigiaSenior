import { Request, Response, NextFunction } from 'express';
import { deviceIdParamSchema } from '../validators/deviceValidator';
import { deviceEventBodySchema } from '../validators/eventValidator';
import { handleDeviceEvent } from '../services/eventService';

export async function postDeviceEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const params = deviceIdParamSchema.parse(req.params);
    const body = deviceEventBodySchema.parse(req.body);

    const result = await handleDeviceEvent(params.deviceId, body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
