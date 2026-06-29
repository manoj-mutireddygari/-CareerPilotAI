import { Router } from 'express';
import { listCollection } from '../services/storage.service';

export const resumeVersionsRouter = Router();

resumeVersionsRouter.get('/', async (_req, res) => {
  const versions = await listCollection('resume_versions', 50);
  res.json({ versions });
});
