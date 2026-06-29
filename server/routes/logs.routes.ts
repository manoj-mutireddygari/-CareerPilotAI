import { Router } from 'express';
import { listCollection } from '../services/storage.service';

export const logsRouter = Router();

logsRouter.get('/', async (_req, res) => {
  const logs = await listCollection('automation_logs', 50);
  res.json({ logs });
});
