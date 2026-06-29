import { Router } from 'express';
import { fetchGoogleJobs } from '../services/jobs.service';
import { listCollection } from '../services/storage.service';

export const jobsRouter = Router();

jobsRouter.get('/matched', async (_req, res) => {
  const jobs = await listCollection('matched_jobs', 50);
  const seen = new Set<string>();
  const uniqueJobs = jobs.filter((job) => {
    const record = job as { applyLink?: string; company?: string; role?: string };
    const key = (record.applyLink || `${record.company || ''}-${record.role || ''}`).trim().toLowerCase();
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
