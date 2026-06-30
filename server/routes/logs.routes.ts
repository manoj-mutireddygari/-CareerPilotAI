import { Router } from 'express';
import { listCollectionWhere } from '../services/storage.service';

export const logsRouter = Router();

logsRouter.get('/', async (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const logs = await listCollectionWhere('automation_logs', 'userId', userId, 50);
  res.json({ logs });
});
