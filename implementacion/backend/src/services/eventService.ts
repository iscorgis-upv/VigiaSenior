import { findDeviceById } from '../repositories/deviceRepository';
import { createDeviceEvent, findScheduledDoseById, confirmScheduledDose } from '../repositories/eventRepository';
import { DeviceEventBody, DeviceEventResponse } from '../types/event';

export class DeviceEventError extends Error {
  public status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'DeviceEventError';
    this.status = status;
  }
}

export async function handleDeviceEvent(deviceId: string, event: DeviceEventBody): Promise<DeviceEventResponse> {
  const device = await findDeviceById(deviceId);
  if (!device) {
    throw new DeviceEventError(`Device not found: ${deviceId}`, 404);
  }

  let patientId = device.patientId;

  if (event.eventType === 'dose_confirmed') {
    const payload = event.payload as { doseId: string };
    const scheduledDose = await findScheduledDoseById(payload.doseId);
    if (!scheduledDose) {
      throw new DeviceEventError(`Scheduled dose not found: ${payload.doseId}`, 404);
    }
    if (scheduledDose.deviceId !== deviceId) {
      throw new DeviceEventError('Dose does not belong to the current device', 422);
    }
    await confirmScheduledDose(payload.doseId, new Date(event.timestamp));
    patientId = scheduledDose.patientId;
  }

  const saved = await createDeviceEvent(deviceId, event, patientId);

  return {
    eventId: saved.id,
    status: 'accepted',
    receivedAt: saved.createdAt.toISOString(),
  };
}
