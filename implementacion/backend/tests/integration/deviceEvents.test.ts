import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import deviceRoutes from '../../../src/routes/deviceRoutes';
import { prisma } from '../../../src/prisma/client';

const app = express();
app.use(express.json());
app.use('/api/devices', deviceRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err?.status ?? 400;
  res.status(status).json({ error: err?.message ?? 'Unexpected error' });
});

describe('POST /api/devices/:deviceId/events', () => {
  let deviceId: string;
  let scheduledDoseId: string;
  let doseScheduleId: string;
  let medicationPlanId: string;

  beforeAll(async () => {
    const caregiver = await prisma.caregiver.create({
      data: {
        name: 'Event Test Caregiver',
        email: 'event-caregiver@example.com',
        phone: '+34123456789',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        name: 'Event Test Patient',
        email: 'event-patient@example.com',
        dateOfBirth: new Date('1955-01-01T00:00:00Z'),
        caregiverId: caregiver.id,
      },
    });

    const device = await prisma.device.create({
      data: {
        serial: 'EVENT-DEVICE-001',
        name: 'Event Device',
        boxCount: 4,
        active: true,
        patientId: patient.id,
      },
    });
    deviceId = device.id;

    const medicationPlan = await prisma.medicationPlan.create({
      data: {
        patientId: patient.id,
        deviceId: device.id,
        name: 'Event Test Plan',
        description: 'Plan para eventos',
        confirmationTimeoutSeconds: 90,
        slotCount: 4,
      },
    });
    medicationPlanId = medicationPlan.id;

    const doseSchedule = await prisma.doseSchedule.create({
      data: {
        medicationPlanId: medicationPlan.id,
        medicationName: 'TestMed',
        dosage: '1 unidad',
        slotNumber: 1,
        scheduledTime: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 8, 0, 0)),
        windowMinutesBefore: 10,
        windowMinutesAfter: 15,
        requiresConfirmation: true,
      },
    });
    doseScheduleId = doseSchedule.id;

    const startOfToday = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      0,
      0,
      0,
      0,
    ));

    const scheduledDose = await prisma.scheduledDose.create({
      data: {
        doseScheduleId: doseSchedule.id,
        deviceId: device.id,
        patientId: patient.id,
        scheduledDate: startOfToday,
        state: 'scheduled',
        confirmationDeadline: new Date(startOfToday.getTime() + 8 * 60 * 60 * 1000),
      },
    });

    scheduledDoseId = scheduledDose.id;
  });

  afterAll(async () => {
    await prisma.deviceEvent.deleteMany({ where: { deviceId } });
    await prisma.scheduledDose.deleteMany({ where: { id: scheduledDoseId } });
    await prisma.doseSchedule.deleteMany({ where: { id: doseScheduleId } });
    await prisma.medicationPlan.deleteMany({ where: { id: medicationPlanId } });
    await prisma.device.deleteMany({ where: { id: deviceId } });
    await prisma.patient.deleteMany({ where: { email: 'event-patient@example.com' } });
    await prisma.caregiver.deleteMany({ where: { email: 'event-caregiver@example.com' } });
    await prisma.$disconnect();
  });

  it('accepts a valid box_opened payload', async () => {
    const response = await request(app)
      .post(`/api/devices/${deviceId}/events`)
      .send({
        eventType: 'box_opened',
        timestamp: new Date().toISOString(),
        payload: {
          slotNumber: 1,
          doseId: scheduledDoseId,
        },
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        eventId: expect.any(String),
        status: 'accepted',
        receivedAt: expect.any(String),
      }),
    );
  });

  it('accepts a valid dose_confirmed payload', async () => {
    const response = await request(app)
      .post(`/api/devices/${deviceId}/events`)
      .send({
        eventType: 'dose_confirmed',
        timestamp: new Date().toISOString(),
        payload: {
          doseId: scheduledDoseId,
          method: 'button',
        },
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        eventId: expect.any(String),
        status: 'accepted',
        receivedAt: expect.any(String),
      }),
    );
  });

  it('returns 400 for an invalid event type', async () => {
    const response = await request(app)
      .post(`/api/devices/${deviceId}/events`)
      .send({
        eventType: 'invalid_event',
        timestamp: new Date().toISOString(),
        payload: {},
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('returns 404 for a nonexistent device', async () => {
    await request(app)
      .post('/api/devices/ck7vxcfdb0006b80re2dwmnfn/events')
      .send({
        eventType: 'box_opened',
        timestamp: new Date().toISOString(),
        payload: {
          slotNumber: 1,
        },
      })
      .expect(404);
  });

  it('returns 400 for a malformed payload', async () => {
    const response = await request(app)
      .post(`/api/devices/${deviceId}/events`)
      .send({
        eventType: 'box_opened',
        timestamp: 'not-a-valid-date',
        payload: {
          slotNumber: 'one',
        },
      })
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
