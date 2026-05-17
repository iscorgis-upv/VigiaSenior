import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import deviceRoutes from './routes/deviceRoutes';
import patientRoutes from './routes/patientRoutes';
import alertRoutes from './routes/alertRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/devices', deviceRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api', alertRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err?.status ?? 500;
  const message = err?.message ?? 'Internal server error';
  res.status(status).json({ error: message });
});

export default app;
