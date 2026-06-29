import type { AutomationLog, AutomationNode, JobMatch } from '../types/domain';

export const workflowNodes = [
  'Resume Upload',
  'Resume Parser',
  'AI Skill Extraction',
  'Google Jobs Search',
  'Job Matching',
  'ATS Keyword Guidance',
  'Email Generator',
  'Automation Completed'
];

export const pipelineNodes: AutomationNode[] = [
  { id: 'resume', label: 'Resume Uploaded', status: 'completed', detail: 'PDF stored securely' },
  { id: 'extract', label: 'Extract Resume', status: 'completed', detail: '3 pages parsed' },
  { id: 'skills', label: 'Extract Skills', status: 'completed', detail: '42 signals found' },
  { id: 'fetch', label: 'Fetch Jobs', status: 'running', detail: 'Google Jobs query live' },
  { id: 'analyze', label: 'Analyze Jobs', status: 'waiting', detail: 'Queued' },
  { id: 'score', label: 'Calculate Match Score', status: 'waiting', detail: 'Queued' },
  { id: 'ats', label: 'Generate ATS Guidance', status: 'waiting', detail: 'Queued' },
  { id: 'email', label: 'Generate Email', status: 'waiting', detail: 'Queued' },
  { id: 'send', label: 'Send Email', status: 'waiting', detail: 'Queued' },
  { id: 'logs', label: 'Save Logs', status: 'waiting', detail: 'Queued' }
];

export const jobMatches: JobMatch[] = [
  {
    id: '1',
    company: 'Google',
    role: 'AI Engineer, Search Intelligence',
    location: 'Bengaluru',
    matchScore: 94,
    salary: '₹32L - ₹48L',
    postedDate: 'Today',
    missingSkills: ['Vertex AI'],
    recommendation: 'Strong match across React, Python, embeddings, and product automation.',
    applyLink: '#'
  },
  {
    id: '2',
    company: 'Zoho',
    role: 'Full Stack Developer - AI Products',
    location: 'Chennai',
    matchScore: 91,
    salary: '₹18L - ₹28L',
    postedDate: '1 day ago',
    missingSkills: ['Redis Streams'],
    recommendation: 'Excellent product engineering fit with high backend and UI overlap.',
    applyLink: '#'
  },
  {
    id: '3',
    company: 'Freshworks',
    role: 'ML Platform Engineer',
    location: 'Hyderabad',
    matchScore: 88,
    salary: '₹24L - ₹36L',
    postedDate: '2 days ago',
    missingSkills: ['Kubeflow'],
    recommendation: 'Good ML systems alignment with a small infrastructure gap.',
    applyLink: '#'
  }
];

export const automationLogs: AutomationLog[] = [
  {
    id: 'log-1',
    startTime: '20:00:00',
    endTime: '20:00:42',
    duration: '42s',
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationMs: 42000,
    jobsRetrieved: 42,
    jobsMatched: 9,
    resumesGenerated: 3,
    emailsSent: 1,
    errors: [],
    steps: pipelineNodes.map((node) => ({ ...node, status: 'completed' }))
  },
  {
    id: 'log-2',
    startTime: '20:00:00',
    endTime: '20:01:08',
    duration: '68s',
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationMs: 68000,
    jobsRetrieved: 37,
    jobsMatched: 7,
    resumesGenerated: 3,
    emailsSent: 1,
    errors: [],
    steps: pipelineNodes.map((node) => ({ ...node, status: 'completed' }))
  }
];

export const consoleLines = [
  '[20:00:00] Automation Started',
  '[20:00:04] Resume Loaded',
  '[20:00:08] Searching Google Jobs...',
  '[20:00:12] 42 Jobs Retrieved',
  '[20:00:18] Matching Jobs',
  '[20:00:26] Generating ATS Keyword Guidance',
  '[20:00:31] Generating Email',
  '[20:00:35] Email Sent Successfully',
  'Completed'
];
