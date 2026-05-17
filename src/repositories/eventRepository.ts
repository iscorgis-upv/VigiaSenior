import { prisma } from '../prisma/client';
import { DeviceEventBody } from '../types/event';

export async function createDeviceEvent(deviceId: string, event: DeviceEventBody, patientId?: string) {
  return prisma.deviceEvent.create({
    data: {
      deviceId,
      patientId,
      type: event.eventType,
      timestamp: new Date(event.timestamp),
      payload: event.payload as any,
    },
  });
}

export async function findScheduledDoseById(doseId: string) {
  return prisma.scheduledDose.findUnique({
    where: { id: doseId },
    select: {
      id: true,
      deviceId: true,
      patientId: true,
      state: true,
    },
  });
}

export async function confirmScheduledDose(doseId: string, confirmedAt: Date) {
  return prisma.scheduledDose.update({
    where: { id: doseId },
    data: {
      state: 'confirmed',
      confirmedAt,
    },
  });
}
