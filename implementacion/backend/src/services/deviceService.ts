import { findDeviceById, findTodaySchedulesByDevice } from '../repositories/deviceRepository';
import { DeviceScheduleTodayResponse } from '../types/device';

export class DeviceNotFoundError extends Error {
  public status = 404;
  constructor(deviceId: string) {
    super(`Device not found: ${deviceId}`);
    this.name = 'DeviceNotFoundError';
  }
}

export async function getTodayScheduleForDevice(deviceId: string, now = new Date()): Promise<DeviceScheduleTodayResponse> {
  const device = await findDeviceById(deviceId);
  if (!device) {
    throw new DeviceNotFoundError(deviceId);
  }

  const schedules = await findTodaySchedulesByDevice(deviceId, now);

  const doses = schedules.map((scheduledDose) => ({
    scheduledDoseId: scheduledDose.id,
    doseScheduleId: scheduledDose.doseSchedule.id,
    medicationName: scheduledDose.doseSchedule.medicationName,
    dosage: scheduledDose.doseSchedule.dosage,
    slotNumber: scheduledDose.doseSchedule.slotNumber,
    scheduledTime: scheduledDose.doseSchedule.scheduledTime.toISOString(),
    windowMinutesBefore: scheduledDose.doseSchedule.windowMinutesBefore,
    windowMinutesAfter: scheduledDose.doseSchedule.windowMinutesAfter,
    requiresConfirmation: scheduledDose.doseSchedule.requiresConfirmation,
    state: scheduledDose.state,
    confirmationDeadline: scheduledDose.confirmationDeadline?.toISOString() ?? undefined,
    openedAt: scheduledDose.openedAt?.toISOString() ?? undefined,
    confirmedAt: scheduledDose.confirmedAt?.toISOString() ?? undefined,
  }));

  const confirmationTimeoutSeconds = schedules.length > 0 ? schedules[0].doseSchedule.medicationPlan.confirmationTimeoutSeconds : 60;

  return {
    deviceId: device.id,
    patientId: device.patientId ?? null,
    date: now.toISOString().slice(0, 10),
    confirmationTimeoutSeconds,
    doses,
  };
}
