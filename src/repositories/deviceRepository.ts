import { prisma } from '../prisma/client';

export async function findDeviceById(deviceId: string) {
  return prisma.device.findUnique({
    where: { id: deviceId },
    select: {
      id: true,
      patientId: true,
    },
  });
}

export async function findTodaySchedulesByDevice(deviceId: string, date: Date) {
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

  return prisma.scheduledDose.findMany({
    where: {
      deviceId,
      scheduledDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      doseSchedule: {
        include: {
          medicationPlan: true,
        },
      },
    },
    orderBy: {
      scheduledDate: 'asc',
    },
  });
}
