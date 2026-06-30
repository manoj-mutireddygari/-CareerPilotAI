import { Router } from 'express';
import { listCollectionWhere } from '../services/storage.service';

export const resumeVersionsRouter = Router();

resumeVersionsRouter.get('/', async (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const versions = await listCollectionWhere('resume_versions', 'userId', userId, 50);
  res.json({ versions });
});
