import express from 'express';
import request from 'supertest';
import deviceRoutes from '../../../src/routes/deviceRoutes';
import { prisma } from '../../../src/prisma/client';

const app = express();
app.use(express.json());
app.use('/api/devices', deviceRoutes);

describe('GET /api/devices/:deviceId/schedule/today', () => {
  let deviceWithScheduleId: string;
  let deviceWithoutScheduleId: string;
  let deletedDeviceId: string;
  let medicationPlanId: string;

  beforeAll(async () => {
    const caregiver = await prisma.caregiver.create({
      data: {
        name: 'Test Caregiver',
        email: 'caregiver@example.com',
        phone: '+34111111111',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        name: 'Test Patient',
        email: 'patient@example.com',
        dateOfBirth: new Date('1950-01-01T00:00:00Z'),
        caregiverId: caregiver.id,
      },
    });

    const deviceWithSchedule = await prisma.device.create({
      data: {
        serial: 'TEST-DEVICE-001',
        name: 'Device With Schedule',
        boxCount: 4,
        active: true,
        patientId: patient.id,
      },
    });
    deviceWithScheduleId = deviceWithSchedule.id;

    const medicationPlan = await prisma.medicationPlan.create({
      data: {
        patientId: patient.id,
        deviceId: deviceWithSchedule.id,
        name: 'Test Plan',
        description: 'Plan para prueba',
        confirmationTimeoutSeconds: 90,
        slotCount: 4,
      },
    });
    medicationPlanId = medicationPlan.id;

    const doseSchedule = await prisma.doseSchedule.create({
      data: {
        medicationPlanId: medicationPlan.id,
        medicationName: 'Aspirina',
        dosage: '1 comprimido',
        slotNumber: 1,
        scheduledTime: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 8, 0, 0)),
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
        doseScheduleId: doseSchedule.id,
        deviceId: deviceWithSchedule.id,
        patientId: patient.id,
        scheduledDate: startOfToday,
        state: 'scheduled',
        confirmationDeadline: new Date(startOfToday.getTime() + 8 * 60 * 60 * 1000),
      },
    });

    const deviceWithoutSchedule = await prisma.device.create({
      data: {
        serial: 'TEST-DEVICE-002',
        name: 'Device Without Schedule',
        boxCount: 4,
        active: true,
        patientId: patient.id,
      },
    });
    deviceWithoutScheduleId = deviceWithoutSchedule.id;

    const deletedDevice = await prisma.device.create({
      data: {
        serial: 'TEST-DEVICE-003',
        name: 'Deleted Device',
        boxCount: 4,
        active: true,
        patientId: patient.id,
      },
    });
    deletedDeviceId = deletedDevice.id;
    await prisma.device.delete({ where: { id: deletedDeviceId } });
  });

  afterAll(async () => {
    await prisma.scheduledDose.deleteMany({ where: { deviceId: deviceWithScheduleId } });
    await prisma.doseSchedule.deleteMany({ where: { medicationPlanId } });
    await prisma.medicationPlan.deleteMany({ where: { id: medicationPlanId } });
    await prisma.device.deleteMany({ where: { id: { in: [deviceWithScheduleId, deviceWithoutScheduleId] } } });
    await prisma.patient.deleteMany({ where: { email: 'patient@example.com' } });
    await prisma.caregiver.deleteMany({ where: { email: 'caregiver@example.com' } });
    await prisma.$disconnect();
  });

  it('returns schedule for a device with planning today', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceWithScheduleId}/schedule/today`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        deviceId: deviceWithScheduleId,
        doses: expect.any(Array),
      }),
    );
    expect(response.body.doses.length).toBeGreaterThan(0);
    expect(response.body.doses[0]).toEqual(
      expect.objectContaining({
        doseScheduleId: expect.any(String),
        medicationName: 'Aspirina',
        scheduledTime: expect.any(String),
      }),
    );
  });

  it('returns 404 for a nonexistent device', async () => {
    await request(app)
      .get(`/api/devices/${deletedDeviceId}/schedule/today`)
      .expect(404);
  });

  it('returns empty doses array for a device with no planning today', async () => {
    const response = await request(app)
      .get(`/api/devices/${deviceWithoutScheduleId}/schedule/today`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        deviceId: deviceWithoutScheduleId,
        doses: expect.any(Array),
      }),
    );
    expect(response.body.doses).toHaveLength(0);
  });
});
