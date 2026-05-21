import {
  findPatientWithCaregiverById,
} from '../repositories/patientRepository';
import {
  AlertListItem,
  AlertRecord,
  findAlertById,
  findAlertsByPatientId,
  resolveAlertById,
} from '../repositories/alertRepository';

export class PatientNotFoundError extends Error {
  public status = 404;

  constructor(patientId: string) {
    super(`Patient not found: ${patientId}`);
    this.name = 'PatientNotFoundError';
  }
}

export class AlertNotFoundError extends Error {
  public status = 404;

  constructor(alertId: string) {
    super(`Alert not found: ${alertId}`);
    this.name = 'AlertNotFoundError';
  }
}

export class AlertAlreadyResolvedError extends Error {
  public status = 409;

  constructor(alertId: string, status: string) {
    super(`Alert ${alertId} cannot be resolved because its status is '${status}'`);
    this.name = 'AlertAlreadyResolvedError';
  }
}

export interface PatientAlertsResponse {
  patientId: string;
  alerts: AlertListItem[];
  total: number;
  openCount: number;
  resolvedCount: number;
}

export interface AlertResolutionResult {
  alertId: string;
  patientId: string;
  deviceId: string | null;
  scheduledDoseId: string | null;
  status: 'resolved';
  message: string;
  updatedAt: string;
  resolvedAt: string;
}

export async function getPatientAlerts(patientId: string): Promise<PatientAlertsResponse> {
  const patient = await findPatientWithCaregiverById(patientId);
  if (!patient) {
    throw new PatientNotFoundError(patientId);
  }

  const alerts = await findAlertsByPatientId(patientId);
  const openCount = alerts.filter((alert) => alert.status === 'open').length;
  const resolvedCount = alerts.filter((alert) => alert.status === 'resolved').length;

  return {
    patientId,
    alerts,
    total: alerts.length,
    openCount,
    resolvedCount,
  };
}

function formatAlertResolutionResult(alert: AlertRecord): AlertResolutionResult {
  const timestamp = alert.updatedAt ?? new Date();
  const isoTimestamp = timestamp.toISOString();

  return {
    alertId: alert.id,
    patientId: alert.patientId,
    deviceId: alert.deviceId,
    scheduledDoseId: alert.scheduledDoseId,
    status: 'resolved',
    message: alert.message,
    updatedAt: isoTimestamp,
    resolvedAt: isoTimestamp,
  };
}

export async function resolveAlert(alertId: string): Promise<AlertResolutionResult> {
  const alert = await findAlertById(alertId);
  if (!alert) {
    throw new AlertNotFoundError(alertId);
  }

  if (alert.status !== 'open') {
    throw new AlertAlreadyResolvedError(alertId, alert.status);
  }

  const updatedAlert = await resolveAlertById(alertId);
  return formatAlertResolutionResult(updatedAlert);
}
