import { Router } from 'express';
import { listCollectionWhere } from '../services/storage.service';

export const emailsRouter = Router();

emailsRouter.get('/', async (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const emails = await listCollectionWhere('emails', 'userId', userId, 50);
  res.json({ emails });
});
