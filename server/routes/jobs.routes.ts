import { Router } from 'express';
import { fetchGoogleJobs } from '../services/jobs.service';
import { listCollectionWhere } from '../services/storage.service';

export const jobsRouter = Router();

jobsRouter.get('/matched', async (req, res) => {
  const userId = String(req.query.userId || '');
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const jobs = await listCollectionWhere('matched_jobs', 'userId', userId, 100);
  const seen = new Set<string>();
  const uniqueJobs = jobs.filter((job) => {
    const record = job as { id?: string; applyLink?: string; company?: string; role?: string; location?: string };
    const key = (
      record.id ||
      record.applyLink ||
      `${record.company || ''}-${record.role || ''}-${record.location || ''}`
    )
      .trim()
      .toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  res.json({ jobs: uniqueJobs });
});

jobsRouter.post('/search', async (req, res) => {
  const jobs = await fetchGoogleJobs(req.body.domains || ['AI Engineer'], req.body.locations || ['Remote']);
  res.json({ jobs });
});
