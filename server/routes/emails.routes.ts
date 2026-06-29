import { Router } from 'express';
import { listCollection } from '../services/storage.service';

export const emailsRouter = Router();

emailsRouter.get('/', async (_req, res) => {
  const emails = await listCollection('emails', 50);
  res.json({ emails });
});
