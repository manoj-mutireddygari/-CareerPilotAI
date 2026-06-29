import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { automationRouter } from './routes/automation.routes';
import { emailsRouter } from './routes/emails.routes';
import { jobsRouter } from './routes/jobs.routes';
import { logsRouter } from './routes/logs.routes';
import { resumeRouter } from './routes/resume.routes';
import { resumeVersionsRouter } from './routes/resumeVersions.routes';
import { startScheduler } from './scheduler/automationCron';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const port = Number(process.env.PORT || 8080);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '..', 'dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use((req, _res, next) => {
  req.app.set('upload', upload);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'careerpilot-ai', timestamp: new Date().toISOString() });
});

app.use('/api/resume', resumeRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/automation', automationRouter);
app.use('/api/logs', logsRouter);
app.use('/api/resume-versions', resumeVersionsRouter);
app.use('/api/emails', emailsRouter);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }

  if (!fs.existsSync(clientIndexPath)) {
    res.status(404).json({
      error: 'React build not found. Run npm run build before starting the production server.'
    });
    return;
  }

  res.sendFile(clientIndexPath);
});

app.listen(port, () => {
  startScheduler();
  console.log(`CareerPilot AI backend listening on http://localhost:${port}`);
  console.log(`Serving React build from ${clientDistPath}`);
});
