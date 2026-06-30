import type { AutomationRequest, AutomationRunResult, ResumeProfile } from '../types';
import { generateAtsResume, generateEmail, matchJobWithAi } from './ai.service';
import { sendCareerEmail } from './email.service';
import { fetchGoogleJobs } from './jobs.service';
import { getDocument, listCollectionWhere, saveCollectionItem } from './storage.service';

interface UserDocument {
  resumeProfile?: ResumeProfile;
}

function jobKey(job: { applyLink?: string; company?: string; role?: string }) {
  const record = job as { id?: string; location?: string };
  return (
    record.id ||
    job.applyLink ||
    `${job.company || ''}-${job.role || ''}-${record.location || ''}`
  )
    .trim()
    .toLowerCase();
}

export async function runAutomation(request: AutomationRequest): Promise<AutomationRunResult> {
  const started = Date.now();
  const errors: string[] = [];
  const userId = request.userId || 'demo-user';
  const matchThreshold = 80;
  const fallbackMatchCount = 3;

  try {
    const userDocument = await getDocument<UserDocument>('users', userId);
    const profile = userDocument?.resumeProfile;

    if (!profile) {
      throw new Error('Upload and parse a resume before running automation.');
    }

    const jobs = await fetchGoogleJobs(request.domains, request.locations);
    const existingMatchedJobs = await listCollectionWhere('matched_jobs', 'userId', userId, 500);
    const existingKeys = new Set(existingMatchedJobs.map((job) => jobKey(job as { applyLink?: string; company?: string; role?: string })));
    const freshJobs = jobs.filter((job) => !existingKeys.has(jobKey(job)));
    const matches = await Promise.all(freshJobs.map(async (job) => ({ job, match: await matchJobWithAi(profile, job) })));
    const matchedJobs =
      matches.filter(({ match }) => match.matchScore >= matchThreshold).sort((a, b) => b.match.matchScore - a.match.matchScore) ||
      [];

    const selectedMatches =
      matchedJobs.length > 0
        ? matchedJobs
        : matches.sort((a, b) => b.match.matchScore - a.match.matchScore).slice(0, fallbackMatchCount);
    const keywordGuides = await Promise.all(selectedMatches.map(({ job }) => generateAtsResume(profile, job)));
    const generatedEmail = await generateEmail(selectedMatches);
    const emailResult = selectedMatches.length
      ? await sendCareerEmail(
          request.recipientEmail,
          generatedEmail.subject,
          generatedEmail.body,
          keywordGuides.map((content: string, index: number) => ({ filename: `ats-keyword-guide-${index + 1}.txt`, content }))
        )
      : { skipped: true, reason: 'No new matched jobs to email' };

    await Promise.all([
      ...selectedMatches.map(({ job, match }) => saveCollectionItem('matched_jobs', { userId, ...job, ...match })),
      ...keywordGuides.map((content, index) => saveCollectionItem('resume_versions', { userId, content, type: 'ats-keyword-guide', jobId: selectedMatches[index]?.job.id })),
      saveCollectionItem('emails', {
        userId,
        to: request.recipientEmail,
        subject: generatedEmail.subject,
        body: generatedEmail.body,
        sent: !('skipped' in emailResult)
      })
    ]);

    const result: AutomationRunResult = {
      startedAt: new Date(started).toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      jobsRetrieved: jobs.length,
      jobsMatched: selectedMatches.length,
      resumesGenerated: keywordGuides.length,
      emailsSent: 'skipped' in emailResult ? 0 : 1,
      errors
    };

    await saveCollectionItem('automation_logs', { userId, ...result, recipientEmail: request.recipientEmail });
    return result;
  } catch (error) {
    errors.push(error instanceof Error ? error.message : 'Unknown automation error');
    const result: AutomationRunResult = {
      startedAt: new Date(started).toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      jobsRetrieved: 0,
      jobsMatched: 0,
      resumesGenerated: 0,
      emailsSent: 0,
      errors
    };
    await saveCollectionItem('automation_logs', { userId, ...result, recipientEmail: request.recipientEmail });
    return result;
  }
}
