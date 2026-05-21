export type PatientDashboardDeviceStatus = 'online' | 'offline' | 'error';
export type PatientDashboardDoorState = 'closed' | 'opened';
export type PatientDashboardSessionStatus = 'waiting' | 'opened' | 'confirmed' | 'missed';
export type PatientDashboardNextDoseStatus = 'scheduled' | 'due' | 'inProgress';
export type PatientDashboardTodayDoseStatus = 'taken' | 'missed' | 'pending' | 'late';
export type PatientDashboardAlertType = 'missedDose' | 'deviceOffline' | 'lowBattery' | 'confirmationTimeout';
export type PatientDashboardAlertSeverity = 'low' | 'medium' | 'high' | string;

export interface PatientDashboardPatient {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  room: string;
  primaryCaregiver: {
    name: string;
    contact: string;
  };
}

export interface PatientDashboardDeviceCurrentSession {
  scheduledDoseId: string | null;
  openedAt: string | null;
  confirmationDeadline: string | null;
  confirmedAt: string | null;
  status: PatientDashboardSessionStatus;
}

export interface PatientDashboardDevice {
  id: string;
  status: PatientDashboardDeviceStatus;
  batteryLevel: number | null;
  lastSeenAt: string | null;
  doorState: PatientDashboardDoorState;
  currentSession: PatientDashboardDeviceCurrentSession;
}

export interface PatientDashboardDoseItem {
  doseId: string;
  scheduledTime: string;
  medication: string;
  dose: string;
  status: PatientDashboardNextDoseStatus | PatientDashboardTodayDoseStatus;
  confirmationDeadline?: string | null;
  openedAt?: string | null;
  confirmedAt?: string | null;
  confirmationWindowMinutes?: number;
}

export interface PatientDashboardAlert {
  alertId: string;
  type: PatientDashboardAlertType;
  severity: PatientDashboardAlertSeverity;
  message: string;
  createdAt: string;
  relatedDoseId: string | null;
}

export interface PatientDashboardComplianceSummary {
  period: 'today' | 'week';
  takenCount: number;
  missedCount: number;
  pendingCount: number;
  percent: number;
  lastUpdatedAt: string;
}

export interface PatientDashboardResponse {
  patient: PatientDashboardPatient;
  device: PatientDashboardDevice;
  nextDoses: PatientDashboardDoseItem[];
  todayDoses: PatientDashboardDoseItem[];
  activeAlerts: PatientDashboardAlert[];
  complianceSummary: PatientDashboardComplianceSummary;
}
