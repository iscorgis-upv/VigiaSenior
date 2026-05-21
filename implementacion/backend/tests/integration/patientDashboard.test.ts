import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import patientRoutes from '../../../src/routes/patientRoutes';
import { prisma } from '../../../src/prisma/client';

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err?.status ?? 500;
  res.status(status).json({ error: err?.message ?? 'Unexpected error' });
});

describe('GET /api/patients/:patientId/dashboard', () => {
  let patientWithDataId: string;
  let patientWithoutAlertsId: string;
  let caregiverId: string;
  let deviceWithDataId: string;
  let deviceWithoutAlertsId: string;
  let medicationPlanWithDataId: string;
  let medicationPlanWithoutAlertsId: string;

  beforeAll(async () => {
    const caregiver = await prisma.caregiver.create({
      data: {
        name: 'Dashboard Test Caregiver',
        email: 'dashboard-caregiver@example.com',
        phone: '+34123456700',
      },
    });
    caregiverId = caregiver.id;

    const patientWithData = await prisma.patient.create({
      data: {
        name: 'Dashboard Patient With Data',
        email: 'dashboard-with-data@example.com',
        dateOfBirth: new Date('1940-06-15T00:00:00Z'),
        caregiverId,
      },
    });
    patientWithDataId = patientWithData.id;

    const patientWithoutAlerts = await prisma.patient.create({
      data: {
        name: 'Dashboard Patient Without Alerts',
        email: 'dashboard-without-alerts@example.com',
        dateOfBirth: new Date('1942-08-20T00:00:00Z'),
        caregiverId,
      },
    });
    patientWithoutAlertsId = patientWithoutAlerts.id;

    const deviceWithData = await prisma.device.create({
      data: {
        serial: 'DASHBOARD-DEVICE-001',
        name: 'Device With Dashboard Data',
        boxCount: 4,
        active: true,
        patientId: patientWithDataId,
      },
    });
    deviceWithDataId = deviceWithData.id;

    const deviceWithoutAlerts = await prisma.device.create({
      data: {
        serial: 'DASHBOARD-DEVICE-002',
        name: 'Device Without Alerts',
        boxCount: 4,
        active: true,
        patientId: patientWithoutAlertsId,
      },
    });
    deviceWithoutAlertsId = deviceWithoutAlerts.id;

    const medicationPlanWithData = await prisma.medicationPlan.create({
      data: {
        patientId: patientWithDataId,
        deviceId: deviceWithDataId,
        name: 'Dashboard Plan With Alerts',
        description: 'Plan con alertas',
        confirmationTimeoutSeconds: 90,
        slotCount: 4,
      },
    });
    medicationPlanWithDataId = medicationPlanWithData.id;

    const medicationPlanWithoutAlerts = await prisma.medicationPlan.create({
      data: {
        patientId: patientWithoutAlertsId,
        deviceId: deviceWithoutAlertsId,
        name: 'Dashboard Plan Without Alerts',
        description: 'Plan sin alertas',
        confirmationTimeoutSeconds: 90,
        slotCount: 4,
      },
    });
    medicationPlanWithoutAlertsId = medicationPlanWithoutAlerts.id;

    const doseScheduleWithData = await prisma.doseSchedule.create({
      data: {
        medicationPlanId: medicationPlanWithDataId,
        medicationName: 'Amlodipino',
        dosage: '1 comprimido',
        slotNumber: 1,
        scheduledTime: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 8, 0, 0)),
        windowMinutesBefore: 10,
        windowMinutesAfter: 15,
        requiresConfirmation: true,
      },
    });

    const doseScheduleWithoutAlerts = await prisma.doseSchedule.create({
      data: {
        medicationPlanId: medicationPlanWithoutAlertsId,
        medicationName: 'Metformina',
        dosage: '1 comprimido',
        slotNumber: 1,
        scheduledTime: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 10, 0, 0)),
        windowMinutesBefore: 10,
        windowMinutesAfter: 15,
        requiresConfirmation: true,
      },
    });

    const startOfToday = new Date(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      0,
      0,
      0,
      0,
    ));

    await prisma.scheduledDose.create({
      data: {
        doseScheduleId: doseScheduleWithData.id,
        deviceId: deviceWithDataId,
        patientId: patientWithDataId,
        scheduledDate: startOfToday,
        state: 'confirmed',
        openedAt: new Date(startOfToday.getTime() + 8 * 60 * 60 * 1000),
        confirmedAt: new Date(startOfToday.getTime() + 8 * 60 * 60 * 1000 + 30000),
        confirmationDeadline: new Date(startOfToday.getTime() + 8 * 60 * 60 * 1000 + 60000),
      },
    });

    await prisma.scheduledDose.create({
      data: {
        doseScheduleId: doseScheduleWithoutAlerts.id,
        deviceId: deviceWithoutAlertsId,
        patientId: patientWithoutAlertsId,
        scheduledDate: startOfToday,
        state: 'scheduled',
        confirmationDeadline: new Date(startOfToday.getTime() + 10 * 60 * 60 * 1000 + 60000),
      },
    });

    await prisma.alert.create({
      data: {
        patientId: patientWithDataId,
        deviceId: deviceWithDataId,
        type: 'missed_dose',
        severity: 'high',
        status: 'open',
        message: 'Dosis no confirmada dentro de la ventana.',
      },
    });
  });

  afterAll(async () => {
    await prisma.alert.deleteMany({ where: { patientId: patientWithDataId } });
    await prisma.scheduledDose.deleteMany({ where: { patientId: { in: [patientWithDataId, patientWithoutAlertsId] } } });
    await prisma.doseSchedule.deleteMany({ where: { medicationPlanId: { in: [medicationPlanWithDataId, medicationPlanWithoutAlertsId] } } });
    await prisma.medicationPlan.deleteMany({ where: { id: { in: [medicationPlanWithDataId, medicationPlanWithoutAlertsId] } } });
    await prisma.device.deleteMany({ where: { id: { in: [deviceWithDataId, deviceWithoutAlertsId] } } });
    await prisma.patient.deleteMany({ where: { id: { in: [patientWithDataId, patientWithoutAlertsId] } } });
    await prisma.caregiver.deleteMany({ where: { id: caregiverId } });
    await prisma.$disconnect();
  });

  it('returns dashboard for an existing patient with data', async () => {
    const response = await request(app)
      .get(`/api/patients/${patientWithDataId}/dashboard`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        patient: expect.objectContaining({
          id: patientWithDataId,
          name: 'Dashboard Patient With Data',
          age: expect.any(Number),
        }),
        device: expect.objectContaining({
          id: deviceWithDataId,
          status: expect.any(String),
          currentSession: expect.objectContaining({
            scheduledDoseId: expect.any(String),
            status: expect.any(String),
          }),
        }),
        nextDoses: expect.any(Array),
        todayDoses: expect.any(Array),
        activeAlerts: expect.any(Array),
        complianceSummary: expect.objectContaining({
          period: 'today',
          takenCount: expect.any(Number),
          missedCount: expect.any(Number),
          percent: expect.any(Number),
        }),
      }),
    );

    expect(response.body.activeAlerts.length).toBeGreaterThan(0);
  });

  it('returns dashboard for an existing patient without alerts', async () => {
    const response = await request(app)
      .get(`/api/patients/${patientWithoutAlertsId}/dashboard`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        patient: expect.objectContaining({
          id: patientWithoutAlertsId,
          name: 'Dashboard Patient Without Alerts',
        }),
        activeAlerts: expect.any(Array),
      }),
    );
    expect(response.body.activeAlerts).toHaveLength(0);
  });

  it('returns 404 for a nonexistent patient', async () => {
    const nonexistentPatientId = 'ck7vxcfdb0006b80re2dwmnfn';

    const response = await request(app)
      .get(`/api/patients/${nonexistentPatientId}/dashboard`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});
