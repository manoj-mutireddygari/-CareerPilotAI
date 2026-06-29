import pdf from 'pdf-parse';
import type { ResumeProfile } from '../types';
import { analyzeResumeWithAi } from './ai.service';
import { saveDocument } from './storage.service';

export async function parseResume(buffer: Buffer, userId: string): Promise<ResumeProfile> {
  const parsed = await pdf(buffer);
  const profile = await analyzeResumeWithAi(parsed.text);
  const withRawText = { ...profile, rawText: parsed.text };
  await saveDocument('users', userId, { resumeProfile: withRawText, updatedAt: new Date().toISOString() });
  return withRawText;
}
