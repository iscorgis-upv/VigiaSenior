import { prisma } from '../prisma/client';

export type AlertType =
  | 'missed_dose'
  | 'device_offline'
  | 'low_battery'
  | 'confirmation_timeout'
  | 'manual_review';

export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved' | 'dismissed';

export interface AlertListItem {
  id: string;
  patientId: string;
  deviceId: string | null;
  scheduledDoseId: string | null;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  createdAt: Date;
  updatedAt: Date | null;
  relatedEventId: string | null;
}

export interface AlertRecord extends AlertListItem {}

/**
 * List all alerts for a given patient.
 */
export async function findAlertsByPatientId(patientId: string): Promise<AlertListItem[]> {
  return prisma.alert.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      patientId: true,
      deviceId: true,
      scheduledDoseId: true,
      type: true,
      severity: true,
      status: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      relatedEventId: true,
    },
  });
}

/**
 * Fetch a single alert by its unique identifier.
 */
export async function findAlertById(alertId: string): Promise<AlertRecord | null> {
  return prisma.alert.findUnique({
    where: { id: alertId },
    select: {
      id: true,
      patientId: true,
      deviceId: true,
      scheduledDoseId: true,
      type: true,
      severity: true,
      status: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      relatedEventId: true,
    },
  });
}

/**
 * Mark an alert as resolved.
 */
export async function resolveAlertById(alertId: string): Promise<AlertRecord> {
  return prisma.alert.update({
    where: { id: alertId },
    data: {
      status: 'resolved',
    },
    select: {
      id: true,
      patientId: true,
      deviceId: true,
      scheduledDoseId: true,
      type: true,
      severity: true,
      status: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      relatedEventId: true,
    },
  });
}
