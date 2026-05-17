import {
  PatientDashboardResponse,
  PatientDashboardDeviceCurrentSession,
  PatientDashboardDeviceStatus,
  PatientDashboardDoorState,
  PatientDashboardNextDoseStatus,
  PatientDashboardTodayDoseStatus,
  PatientDashboardAlertType,
} from '../types/patient';
import {
  findPatientWithCaregiverById,
  findDeviceByPatientId,
  findLatestDeviceEventByDeviceId,
  findLatestBatteryEventByDeviceId,
  findLatestDoorOpenEventByDeviceId,
  findLatestConfirmationEventByDeviceId,
  findTodaysScheduledDosesByPatientId,
  findUpcomingScheduledDosesByPatientId,
  findOpenAlertsByPatientId,
} from '../repositories/patientRepository';

const ONLINE_THRESHOLD_MINUTES = 15;

type PatientScheduleResult = {
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

type DeviceEventRecord = {
  type: string;
  timestamp: Date;
  payload: unknown;
};

export class PatientNotFoundError extends Error {
  public status = 404;

  constructor(patientId: string) {
    super(`Patient not found: ${patientId}`);
    this.name = 'PatientNotFoundError';
  }
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birth.getUTCMonth();
  const dayDiff = today.getUTCDate() - birth.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

function mapTodayDoseState(state: string): PatientDashboardTodayDoseStatus {
  switch (state) {
    case 'confirmed':
      return 'taken';
    case 'missed':
      return 'missed';
    case 'alerting':
      return 'late';
    default:
      return 'pending';
  }
}

function mapAlertType(type: string): PatientDashboardAlertType {
  switch (type) {
    case 'missed_dose':
      return 'missedDose';
    case 'device_offline':
      return 'deviceOffline';
    case 'low_battery':
      return 'lowBattery';
    case 'confirmation_timeout':
      return 'confirmationTimeout';
    default:
      return 'missedDose';
  }
}

function getBatteryLevelFromPayload(payload: unknown): number | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const batteryPercent = (payload as { batteryPercent?: unknown }).batteryPercent;
  return typeof batteryPercent === 'number' ? batteryPercent : null;
}

function getDoorState(
  lastDoorEvent: DeviceEventRecord | null,
  lastConfirmationEvent: DeviceEventRecord | null,
): PatientDashboardDoorState {
  if (!lastDoorEvent) {
    return 'closed';
  }

  if (!lastConfirmationEvent) {
    return 'opened';
  }

  return lastDoorEvent.timestamp > lastConfirmationEvent.timestamp ? 'opened' : 'closed';
}

function resolveCurrentSessionStatus(schedule: PatientScheduleResult): PatientDashboardDeviceCurrentSession['status'] {
  if (schedule.confirmedAt) {
    return 'confirmed';
  }

  if (schedule.state === 'missed') {
    return 'missed';
  }

  if (schedule.state === 'alerting' || schedule.openedAt) {
    return 'opened';
  }

  return 'waiting';
}

function determineNextDoseStatus(schedule: PatientScheduleResult, now: Date): PatientDashboardNextDoseStatus {
  if (schedule.openedAt && !schedule.confirmedAt) {
    return 'inProgress';
  }

  if (schedule.scheduledDate <= now) {
    return 'due';
  }

  return 'scheduled';
}

function computeDeviceStatus(
  device: { active: boolean } | null,
  lastEvent: DeviceEventRecord | null,
  now: Date,
): PatientDashboardDeviceStatus {
  if (!device) {
    return 'offline';
  }

  if (!device.active) {
    return 'error';
  }

  if (!lastEvent) {
    return 'offline';
  }

  const ageInMs = now.getTime() - lastEvent.timestamp.getTime();
  const thresholdMs = ONLINE_THRESHOLD_MINUTES * 60 * 1000;
  return ageInMs <= thresholdMs ? 'online' : 'offline';
}

export async function getPatientDashboard(
  patientId: string,
  now = new Date(),
): Promise<PatientDashboardResponse> {
  const patient = await findPatientWithCaregiverById(patientId);
  if (!patient) {
    throw new PatientNotFoundError(patientId);
  }

  const device = await findDeviceByPatientId(patientId);

  const [
    todaySchedules,
    upcomingSchedules,
    alerts,
    latestEvent,
    latestBatteryEvent,
    latestDoorEvent,
    latestConfirmationEvent,
  ] = await Promise.all([
    findTodaysScheduledDosesByPatientId(patientId, now),
    findUpcomingScheduledDosesByPatientId(patientId, now),
    findOpenAlertsByPatientId(patientId),
    device ? findLatestDeviceEventByDeviceId(device.id) : Promise.resolve(null),
    device ? findLatestBatteryEventByDeviceId(device.id) : Promise.resolve(null),
    device ? findLatestDoorOpenEventByDeviceId(device.id) : Promise.resolve(null),
    device ? findLatestConfirmationEventByDeviceId(device.id) : Promise.resolve(null),
  ]);

  const lastSeenAt = latestEvent?.timestamp.toISOString() ?? null;
  const batteryLevel = getBatteryLevelFromPayload(latestBatteryEvent?.payload ?? null);
  const doorState = getDoorState(latestDoorEvent, latestConfirmationEvent);
  const deviceStatus = computeDeviceStatus(device, latestEvent, now);

  const currentSchedule = todaySchedules.find((schedule) =>
    schedule.state === 'alerting' ||
    Boolean(schedule.openedAt) ||
    schedule.scheduledDate <= now,
  );

  const currentSession: PatientDashboardDeviceCurrentSession = currentSchedule
    ? {
        scheduledDoseId: currentSchedule.id,
        openedAt: currentSchedule.openedAt?.toISOString() ?? null,
        confirmationDeadline: currentSchedule.confirmationDeadline?.toISOString() ?? null,
        confirmedAt: currentSchedule.confirmedAt?.toISOString() ?? null,
        status: resolveCurrentSessionStatus(currentSchedule),
      }
    : {
        scheduledDoseId: null,
        openedAt: null,
        confirmationDeadline: null,
        confirmedAt: null,
        status: 'waiting',
      };

  const nextDoses = upcomingSchedules.map((schedule) => ({
    doseId: schedule.id,
    scheduledTime: schedule.doseSchedule.scheduledTime.toISOString(),
    medication: schedule.doseSchedule.medicationName,
    dose: schedule.doseSchedule.dosage,
    status: determineNextDoseStatus(schedule, now),
    confirmationWindowMinutes:
      schedule.doseSchedule.windowMinutesBefore + schedule.doseSchedule.windowMinutesAfter,
  }));

  const todayDoses = todaySchedules.map((schedule) => ({
    doseId: schedule.id,
    scheduledTime: schedule.doseSchedule.scheduledTime.toISOString(),
    medication: schedule.doseSchedule.medicationName,
    dose: schedule.doseSchedule.dosage,
    status: mapTodayDoseState(schedule.state),
    openedAt: schedule.openedAt?.toISOString() ?? null,
    confirmedAt: schedule.confirmedAt?.toISOString() ?? null,
    confirmationDeadline: schedule.confirmationDeadline?.toISOString() ?? null,
  }));

  const activeAlerts = alerts.map((alert) => ({
    alertId: alert.id,
    type: mapAlertType(alert.type),
    severity: alert.severity,
    message: alert.message,
    createdAt: alert.createdAt.toISOString(),
    relatedDoseId: alert.scheduledDoseId,
  }));

  const takenCount = todayDoses.filter((dose) => dose.status === 'taken').length;
  const missedCount = todayDoses.filter((dose) => dose.status === 'missed').length;
  const pendingCount = todayDoses.filter(
    (dose) => dose.status === 'pending' || dose.status === 'late',
  ).length;
  const totalCount = takenCount + missedCount + pendingCount;
  const percent = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 100;

  return {
    patient: {
      id: patient.id,
      name: patient.name,
      age: calculateAge(patient.dateOfBirth),
      photoUrl: '',
      room: '',
      primaryCaregiver: {
        name: patient.caregiver?.name ?? '',
        contact: patient.caregiver?.phone ?? patient.caregiver?.email ?? '',
      },
    },
    device: {
      id: device?.id ?? '',
      status: deviceStatus,
      batteryLevel,
      lastSeenAt,
      doorState,
      currentSession,
    },
    nextDoses,
    todayDoses,
    activeAlerts,
    complianceSummary: {
      period: 'today',
      takenCount,
      missedCount,
      pendingCount,
      percent,
      lastUpdatedAt: now.toISOString(),
    },
  };
}
