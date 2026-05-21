import { z } from 'zod';

const deviceOnlinePayload = z.object({
  batteryPercent: z.number().min(0).max(100).optional(),
});

const heartbeatPayload = z.object({
  batteryPercent: z.number().min(0).max(100),
});

const boxOpenedPayload = z.object({
  slotNumber: z.number().int().min(1),
  doseId: z.string().cuid().optional(),
});

const doseConfirmedPayload = z.object({
  doseId: z.string().cuid(),
  method: z.enum(['button', 'manual', 'app']),
});

const alarmStartedPayload = z.object({
  reason: z.string().optional(),
});

const alarmTimeoutPayload = z.object({
  reason: z.string().optional(),
});

export const deviceEventBodySchema = z.discriminatedUnion('eventType', [
  z.object({
    eventType: z.literal('device_online'),
    timestamp: z.string().datetime(),
    payload: deviceOnlinePayload,
    correlationId: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('heartbeat'),
    timestamp: z.string().datetime(),
    payload: heartbeatPayload,
    correlationId: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('box_opened'),
    timestamp: z.string().datetime(),
    payload: boxOpenedPayload,
    correlationId: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('dose_confirmed'),
    timestamp: z.string().datetime(),
    payload: doseConfirmedPayload,
    correlationId: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('alarm_started'),
    timestamp: z.string().datetime(),
    payload: alarmStartedPayload,
    correlationId: z.string().optional(),
  }),
  z.object({
    eventType: z.literal('alarm_timeout'),
    timestamp: z.string().datetime(),
    payload: alarmTimeoutPayload,
    correlationId: z.string().optional(),
  }),
]);

export type DeviceEventBody = z.infer<typeof deviceEventBodySchema>;
