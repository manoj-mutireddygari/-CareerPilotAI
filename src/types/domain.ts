export type PipelineStatus = 'waiting' | 'running' | 'completed' | 'failed';

export interface AutomationNode {
  id: string;
  label: string;
  status: PipelineStatus;
  detail: string;
}

export interface JobMatch {
  id: string;
  company: string;
  role: string;
  location: string;
  matchScore: number;
  salary: string;
  postedDate: string;
  missingSkills: string[];
  whyItMatches?: string;
  recommendation: string;
  applyLink: string;
}

export interface AutomationLog {
  id: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  jobsRetrieved: number;
  jobsMatched: number;
  resumesGenerated: number;
  emailsSent: number;
  errors: string[];
  steps?: AutomationNode[];
  createdAt?: string;
}

export interface AutomationSettings {
  domains: string[];
  locations: string[];
  salary: string;
  experienceLevel: string;
  automationTime: string;
  smtpEmail: string;
}
