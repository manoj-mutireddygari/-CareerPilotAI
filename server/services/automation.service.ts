import type { AutomationRequest, AutomationRunResult, ResumeProfile } from '../types';
import { generateAtsResume, generateEmail, matchJobWithAi } from './ai.service';
import { sendCareerEmail } from './email.service';
import { fetchGoogleJobs } from './jobs.service';
import { getDocument, listCollectionWhere, saveCollectionItem } from './storage.service';

interface UserDocument {
  resumeProfile?: ResumeProfile;
}

function jobKey(job: { applyLink?: string; company?: string; role?: string }) {
  return (job.applyLink || `${job.company || ''}-${job.role || ''}`).trim().toLowerCase();
}

export async function runAutomation(request: AutomationRequest): Promise<AutomationRunResult> {
  const started = Date.now();
  const errors: string[] = [];
  const userId = request.userId || 'demo-user';

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
    const matchedJobs = matches.filter(({ match }) => match.matchScore >= 80).sort((a, b) => b.match.matchScore - a.match.matchScore);
    const keywordGuides = await Promise.all(matchedJobs.map(({ job }) => generateAtsResume(profile, job)));
    const generatedEmail = await generateEmail(matchedJobs);
    const emailResult = matchedJobs.length
      ? await sendCareerEmail(
          request.recipientEmail,
          generatedEmail.subject,
          generatedEmail.body,
          keywordGuides.map((content: string, index: number) => ({ filename: `ats-keyword-guide-${index + 1}.txt`, content }))
        )
      : { skipped: true, reason: 'No new matched jobs to email' };

    await Promise.all([
      ...matchedJobs.map(({ job, match }) => saveCollectionItem('matched_jobs', { userId, ...job, ...match })),
      ...keywordGuides.map((content, index) => saveCollectionItem('resume_versions', { userId, content, type: 'ats-keyword-guide', jobId: matchedJobs[index]?.job.id })),
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
      jobsMatched: matchedJobs.length,
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
