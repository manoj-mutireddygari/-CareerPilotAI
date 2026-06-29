import { Router } from 'express';
import type multer from 'multer';
import { parseResume } from '../services/resume.service';

export const resumeRouter = Router();

resumeRouter.post('/upload', (req, res, next) => {
  const upload = req.app.get('upload') as multer.Multer;
  upload.single('resume')(req, res, next);
}, async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Resume PDF is required' });
      return;
    }

    const profile = await parseResume(req.file.buffer, String(req.body.userId || 'demo-user'));
    res.json({ profile });
  } catch (error) {
    console.error('Resume upload failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Resume upload failed'
    });
  }
});
