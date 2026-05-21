import { prisma } from '../prisma/client';

// Patient-level data required by the dashboard
export type PatientWithCaregiver = {
  id: string;
  name: string;
  dateOfBirth: Date;
  caregiver: {
    name: string;
    phone: string | null;
    email: string | null;
  } | null;
};

export type DeviceSummary = {
  id: string;
  serial: string | null;
  name: string | null;
  active: boolean;
};

export type DeviceEventRecord = {
  type: string;
  timestamp: Date;
  payload: unknown;
};

export type ScheduledDoseWithDetails = {
  id: string;
  scheduledDate: Date;
  state: string;
  openedAt: Date | null;
  confirmedAt: Date | null;
  confirmationDeadline: Date | null;
  doseSchedule: {
    scheduledTime: Date;
    medicationName: string;
    dosage: string;
    windowMinutesBefore: number;
    windowMinutesAfter: number;
    requiresConfirmation: boolean;
    medicationPlan: {
      confirmationTimeoutSeconds: number;
    };
  };
};

export type PatientAlertSummary = {
  id: string;
  type: string;
  severity: string;
  message: string;
  createdAt: Date;
  scheduledDoseId: string | null;
};

export async function findPatientWithCaregiverById(patientId: string): Promise<PatientWithCaregiver | null> {
  return prisma.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      dateOfBirth: true,
      caregiver: {
        select: {
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  });
}

export async function findDeviceByPatientId(patientId: string): Promise<DeviceSummary | null> {
  return prisma.device.findFirst({
    where: { patientId },
    select: {
      id: true,
      serial: true,
      name: true,
      active: true,
    },
  });
}

export async function findLatestDeviceEventByDeviceId(deviceId: string): Promise<DeviceEventRecord | null> {
  return prisma.deviceEvent.findFirst({
    where: { deviceId },
    orderBy: { timestamp: 'desc' },
    select: {
      type: true,
      timestamp: true,
      payload: true,
    },
  });
}

export async function findLatestBatteryEventByDeviceId(deviceId: string): Promise<DeviceEventRecord | null> {
  return prisma.deviceEvent.findFirst({
    where: {
      deviceId,
      type: {
        in: ['heartbeat', 'device_online'],
      },
    },
    orderBy: { timestamp: 'desc' },
    select: {
      type: true,
      timestamp: true,
      payload: true,
    },
  });
}

export async function findLatestDoorOpenEventByDeviceId(deviceId: string): Promise<DeviceEventRecord | null> {
  return prisma.deviceEvent.findFirst({
    where: {
      deviceId,
      type: 'door_open',
    },
    orderBy: { timestamp: 'desc' },
    select: {
      type: true,
      timestamp: true,
      payload: true,
    },
  });
}

export async function findLatestConfirmationEventByDeviceId(deviceId: string): Promise<DeviceEventRecord | null> {
  return prisma.deviceEvent.findFirst({
    where: {
      deviceId,
      type: {
        in: ['confirmation', 'dose_confirmed'],
      },
    },
    orderBy: { timestamp: 'desc' },
    select: {
      type: true,
      timestamp: true,
      payload: true,
    },
  });
}

export async function findTodaysScheduledDosesByPatientId(
  patientId: string,
  date: Date,
): Promise<ScheduledDoseWithDetails[]> {
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

  return prisma.scheduledDose.findMany({
    where: {
      patientId,
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

export async function findUpcomingScheduledDosesByPatientId(
  patientId: string,
  now: Date,
  take = 6,
): Promise<ScheduledDoseWithDetails[]> {
  return prisma.scheduledDose.findMany({
    where: {
      patientId,
      scheduledDate: {
        gte: now,
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
    take,
  });
}

export async function findOpenAlertsByPatientId(patientId: string): Promise<PatientAlertSummary[]> {
  return prisma.alert.findMany({
    where: {
      patientId,
      status: 'open',
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      type: true,
      severity: true,
      message: true,
      createdAt: true,
      scheduledDoseId: true,
    },
  });
}
