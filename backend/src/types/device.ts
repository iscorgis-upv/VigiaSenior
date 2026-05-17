export interface DeviceDoseScheduleItem {
  scheduledDoseId: string;
  doseScheduleId: string;
  medicationName: string;
  dosage: string;
  slotNumber: number;
  scheduledTime: string;
  windowMinutesBefore: number;
  windowMinutesAfter: number;
  requiresConfirmation: boolean;
  state: string;
  confirmationDeadline?: string;
  openedAt?: string;
  confirmedAt?: string;
}

export interface DeviceScheduleTodayResponse {
  deviceId: string;
  patientId: string | null;
  date: string;
  confirmationTimeoutSeconds: number;
  doses: DeviceDoseScheduleItem[];
}
