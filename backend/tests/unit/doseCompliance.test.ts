import { prisma } from '../../src/prisma/client';
import { handleDeviceEvent, DeviceEventError } from '../../src/services/eventService';

describe('Dose compliance rule', () => {
  let patientId: string;
  let deviceId: string;
  let doseScheduleId: string;

  beforeAll(async () => {
    const caregiver = await prisma.caregiver.create({
      data: {
        name: 'Compliance Test Caregiver',
        email: 'compliance-caregiver@example.com',
        phone: '+34123456701',
      },
    });

    const patient = await prisma.patient.create({
      data: {
        name: 'Compliance Test Patient',
        email: 'compliance-patient@example.com',
        dateOfBirth: new Date('1950-01-01T00:00:00Z'),
        caregiverId: caregiver.id,
      },
    });
    patientId = patient.id;

    const device = await prisma.device.create({
      data: {
        serial: 'COMPLIANCE-DEVICE-001',
        name: 'Compliance Device',
        boxCount: 6,
        active: true,
        patientId,
      },
    });
    deviceId = device.id;

    const medicationPlan = await prisma.medicationPlan.create({
      data: {
        patientId,
        deviceId,
        name: 'Compliance Plan',
        description: 'Plan para pruebas de cumplimiento',
        confirmationTimeoutSeconds: 60,
        slotCount: 6,
      },
    });

    const doseSchedule = await prisma.doseSchedule.create({
      data: {
        medicationPlanId: medicationPlan.id,
        medicationName: 'Test Medication',
        dosage: '1 unidad',
        slotNumber: 1,
        scheduledTime: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 8, 0, 0)),
        windowMinutesBefore: 10,
        windowMinutesAfter: 15,
        requiresConfirmation: true,
      },
    });
    doseScheduleId = doseSchedule.id;
  });

  afterAll(async () => {
    await prisma.deviceEvent.deleteMany({ where: { deviceId } });
    await prisma.scheduledDose.deleteMany({ where: { doseScheduleId } });
    await prisma.doseSchedule.deleteMany({ where: { id: doseScheduleId } });
    await prisma.medicationPlan.deleteMany({ where: { deviceId } });
    await prisma.device.deleteMany({ where: { id: deviceId } });
    await prisma.patient.deleteMany({ where: { id: patientId } });
    await prisma.caregiver.deleteMany({ where: { email: 'compliance-caregiver@example.com' } });
    await prisma.$disconnect();
  });

  async function createScheduledDose(overrides: Partial<{ state: string; scheduledDate: Date; confirmationDeadline: Date; }>) {
    const now = new Date();
    const scheduledDate = overrides.scheduledDate ?? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const confirmationDeadline = overrides.confirmationDeadline ?? new Date(now.getTime() + 60 * 1000);

    const dose = await prisma.scheduledDose.create({
      data: {
        doseScheduleId,
        deviceId,
        patientId,
        scheduledDate,
        state: overrides.state ?? 'scheduled',
        confirmationDeadline,
      },
    });

    return dose;
  }

  afterEach(async () => {
    await prisma.deviceEvent.deleteMany({ where: { deviceId } });
    await prisma.scheduledDose.deleteMany({ where: { doseScheduleId } });
  });

  it('keeps a dose pending when box_opened occurs without dose_confirmed', async () => {
    const scheduledDose = await createScheduledDose({
      confirmationDeadline: new Date(Date.now() + 60 * 1000),
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'box_opened',
      timestamp: new Date().toISOString(),
      payload: {
        slotNumber: 1,
        doseId: scheduledDose.id,
      },
    });

    const updatedDose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(updatedDose?.confirmedAt).toBeNull();
    expect(updatedDose?.state).not.toBe('confirmed');
  });

  it('rejects confirmation without prior opening', async () => {
    const scheduledDose = await createScheduledDose({
      confirmationDeadline: new Date(Date.now() + 60 * 1000),
    });

    await expect(
      handleDeviceEvent(deviceId, {
        eventType: 'dose_confirmed',
        timestamp: new Date().toISOString(),
        payload: {
          doseId: scheduledDose.id,
          method: 'button',
        },
      }),
    ).rejects.toEqual(expect.objectContaining({
      name: 'DeviceEventError',
      status: 422,
    }));

    const updatedDose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(updatedDose?.state).not.toBe('confirmed');
  });

  it('rejects confirmation outside the configured confirmation window', async () => {
    const scheduledDose = await createScheduledDose({
      confirmationDeadline: new Date(Date.now() - 10 * 1000),
    });

    await expect(
      handleDeviceEvent(deviceId, {
        eventType: 'dose_confirmed',
        timestamp: new Date().toISOString(),
        payload: {
          doseId: scheduledDose.id,
          method: 'button',
        },
      }),
    ).rejects.toEqual(expect.objectContaining({
      name: 'DeviceEventError',
      status: 422,
    }));

    const updatedDose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(updatedDose?.confirmedAt).toBeNull();
  });

  it('marks a dose as confirmed when open and confirm happen within the window', async () => {
    const scheduledDose = await createScheduledDose({
      confirmationDeadline: new Date(Date.now() + 60 * 1000),
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'box_opened',
      timestamp: new Date().toISOString(),
      payload: {
        slotNumber: 1,
        doseId: scheduledDose.id,
      },
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'dose_confirmed',
      timestamp: new Date().toISOString(),
      payload: {
        doseId: scheduledDose.id,
        method: 'button',
      },
    });

    const updatedDose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(updatedDose?.state).toBe('confirmed');
    expect(updatedDose?.confirmedAt).not.toBeNull();
  });

  it('keeps a dose confirmed after a duplicate confirmation attempt', async () => {
    const scheduledDose = await createScheduledDose({
      confirmationDeadline: new Date(Date.now() + 60 * 1000),
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'box_opened',
      timestamp: new Date().toISOString(),
      payload: {
        slotNumber: 1,
        doseId: scheduledDose.id,
      },
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'dose_confirmed',
      timestamp: new Date().toISOString(),
      payload: {
        doseId: scheduledDose.id,
        method: 'button',
      },
    });

    await handleDeviceEvent(deviceId, {
      eventType: 'dose_confirmed',
      timestamp: new Date().toISOString(),
      payload: {
        doseId: scheduledDose.id,
        method: 'button',
      },
    });

    const updatedDose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(updatedDose?.state).toBe('confirmed');
    expect(updatedDose?.confirmedAt).not.toBeNull();
  });

  it('treats a schedule with an expired confirmation deadline as missed when no confirmation occurs', async () => {
    const scheduledDose = await createScheduledDose({
      state: 'missed',
      confirmationDeadline: new Date(Date.now() - 60 * 1000),
    });

    const dose = await prisma.scheduledDose.findUnique({ where: { id: scheduledDose.id } });
    expect(dose?.state).toBe('missed');
    expect(dose?.confirmedAt).toBeNull();
  });
});
