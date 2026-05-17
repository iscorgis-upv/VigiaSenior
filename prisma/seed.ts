import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.alert.deleteMany();
  await prisma.deviceEvent.deleteMany();
  await prisma.scheduledDose.deleteMany();
  await prisma.doseSchedule.deleteMany();
  await prisma.medicationPlan.deleteMany();
  await prisma.device.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.caregiver.deleteMany();

  const caregiver = await prisma.caregiver.create({
    data: {
      name: 'Lucía García',
      email: 'lucia.garcia@example.com',
      phone: '+34 600 123 456',
    },
  });

  const patient = await prisma.patient.create({
    data: {
      name: 'Carlos Fernández',
      email: 'carlos.fernandez@example.com',
      dateOfBirth: new Date('1948-09-12T00:00:00Z'),
      caregiverId: caregiver.id,
    },
  });

  const device = await prisma.device.create({
    data: {
      serial: 'VS-DEVICE-001',
      name: 'Dispositivo Sala 1',
      boxCount: 6,
      active: true,
      patientId: patient.id,
    },
  });

  const medicationPlan = await prisma.medicationPlan.create({
    data: {
      patientId: patient.id,
      deviceId: device.id,
      name: 'Plan semanal de hipertensión',
      description: 'Tomas de mañana, mediodía y tarde durante 2 días de prueba.',
      confirmationTimeoutSeconds: 90,
      slotCount: 6,
    },
  });

  const schedule1 = await prisma.doseSchedule.create({
    data: {
      medicationPlanId: medicationPlan.id,
      medicationName: 'Amlodipino 5mg',
      dosage: '1 comprimido',
      slotNumber: 1,
      scheduledTime: new Date('2026-05-17T08:00:00Z'),
      windowMinutesBefore: 10,
      windowMinutesAfter: 15,
      requiresConfirmation: true,
    },
  });

  const schedule2 = await prisma.doseSchedule.create({
    data: {
      medicationPlanId: medicationPlan.id,
      medicationName: 'Aspirina 100mg',
      dosage: '1 comprimido',
      slotNumber: 2,
      scheduledTime: new Date('2026-05-17T13:00:00Z'),
      windowMinutesBefore: 10,
      windowMinutesAfter: 15,
      requiresConfirmation: true,
    },
  });

  const schedule3 = await prisma.doseSchedule.create({
    data: {
      medicationPlanId: medicationPlan.id,
      medicationName: 'Metformina 850mg',
      dosage: '1 comprimido',
      slotNumber: 3,
      scheduledTime: new Date('2026-05-17T20:00:00Z'),
      windowMinutesBefore: 10,
      windowMinutesAfter: 15,
      requiresConfirmation: true,
    },
  });

  const scheduledDose1 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule1.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-17T00:00:00Z'),
      state: 'confirmed',
      openedAt: new Date('2026-05-17T08:02:00Z'),
      confirmedAt: new Date('2026-05-17T08:02:45Z'),
      confirmationDeadline: new Date('2026-05-17T08:01:30Z'),
    },
  });

  const scheduledDose2 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule2.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-17T00:00:00Z'),
      state: 'missed',
      confirmationDeadline: new Date('2026-05-17T13:01:30Z'),
    },
  });

  const scheduledDose3 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule3.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-17T00:00:00Z'),
      state: 'alerting',
      confirmationDeadline: new Date('2026-05-17T20:01:30Z'),
    },
  });

  const scheduledDose4 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule1.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-18T00:00:00Z'),
      state: 'scheduled',
      confirmationDeadline: new Date('2026-05-18T08:01:30Z'),
    },
  });

  const scheduledDose5 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule2.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-18T00:00:00Z'),
      state: 'scheduled',
      confirmationDeadline: new Date('2026-05-18T13:01:30Z'),
    },
  });

  const scheduledDose6 = await prisma.scheduledDose.create({
    data: {
      doseScheduleId: schedule3.id,
      deviceId: device.id,
      patientId: patient.id,
      scheduledDate: new Date('2026-05-18T00:00:00Z'),
      state: 'scheduled',
      confirmationDeadline: new Date('2026-05-18T20:01:30Z'),
    },
  });

  await prisma.deviceEvent.createMany({
    data: [
      {
        deviceId: device.id,
        patientId: patient.id,
        type: 'door_open',
        timestamp: new Date('2026-05-17T08:01:55Z'),
        payload: { doseId: scheduledDose1.id },
      },
      {
        deviceId: device.id,
        patientId: patient.id,
        type: 'confirmation',
        timestamp: new Date('2026-05-17T08:02:45Z'),
        payload: { doseId: scheduledDose1.id, method: 'button' },
      },
      {
        deviceId: device.id,
        patientId: patient.id,
        type: 'door_open',
        timestamp: new Date('2026-05-17T19:59:30Z'),
        payload: { doseId: scheduledDose3.id },
      },
      {
        deviceId: device.id,
        patientId: patient.id,
        type: 'heartbeat',
        timestamp: new Date('2026-05-17T21:00:00Z'),
        payload: { batteryPercent: 82 },
      },
    ],
  });

  await prisma.alert.create({
    data: {
      patientId: patient.id,
      deviceId: device.id,
      scheduledDoseId: scheduledDose2.id,
      type: 'missed_dose',
      severity: 'high',
      status: 'open',
      message: 'La dosis de mediodía no se confirmó dentro del límite de tiempo.',
      relatedEventId: null,
    },
  });

  console.log('Seed completado con éxito');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
