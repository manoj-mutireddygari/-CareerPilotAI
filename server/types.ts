export interface ResumeProfile {
  skills: string[];
  projects: string[];
  experience: string[];
  education: string[];
  technologies: string[];
  preferredRoles: string[];
  rawText?: string;
}

export interface CollectedJob {
  id: string;
  company: string;
  role: string;
  description: string;
  applyLink: string;
  salary?: string;
  postedDate?: string;
  location?: string;
}

export interface MatchResult {
  jobId: string;
  matchScore: number;
  whyItMatches: string;
  missingSkills: string[];
  recommendation: string;
}

export interface AutomationRunResult {
  startedAt: string;
  endedAt: string;
  durationMs: number;
  jobsRetrieved: number;
  jobsMatched: number;
  resumesGenerated: number;
  emailsSent: number;
  errors: string[];
}

export interface AutomationRequest {
  userId: string;
  automationId?: string;
  name?: string;
  signature?: string;
  recipientEmail: string;
  domains: string[];
  locations: string[];
  expectedSalary?: string;
  experienceLevel?: string;
  automationTime?: string;
}
