export type DeviceEventType =
  | 'device_online'
  | 'heartbeat'
  | 'box_opened'
  | 'dose_confirmed'
  | 'alarm_started'
  | 'alarm_timeout';

export interface DeviceOnlinePayload {
  batteryPercent?: number;
}

export interface HeartbeatPayload {
  batteryPercent: number;
}

export interface BoxOpenedPayload {
  slotNumber: number;
  doseId?: string;
}

export interface DoseConfirmedPayload {
  doseId: string;
  method: 'button' | 'manual' | 'app';
}

export interface AlarmStartedPayload {
  reason?: string;
}

export interface AlarmTimeoutPayload {
  reason?: string;
}

export type DeviceEventPayload =
  | DeviceOnlinePayload
  | HeartbeatPayload
  | BoxOpenedPayload
  | DoseConfirmedPayload
  | AlarmStartedPayload
  | AlarmTimeoutPayload;

export interface DeviceEventRequest {
  eventType: DeviceEventType;
  timestamp: string;
  payload: DeviceEventPayload;
  correlationId?: string;
}

export interface DeviceEventResponse {
  eventId: string;
  status: 'accepted';
  receivedAt: string;
}

export type DeviceEventBody = DeviceEventRequest;
