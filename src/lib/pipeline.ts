import type { AutomationNode, PipelineStatus } from '../types/domain';

export const initialPipelineNodes: AutomationNode[] = [
  { id: 'resume', label: 'Resume Uploaded', status: 'waiting', detail: 'Waiting for PDF upload' },
  { id: 'extract', label: 'Extract Resume', status: 'waiting', detail: 'Waiting for parser' },
  { id: 'skills', label: 'Extract Skills', status: 'waiting', detail: 'Waiting for AI analysis' },
  { id: 'fetch', label: 'Fetch Jobs', status: 'waiting', detail: 'Waiting for Google Jobs search' },
  { id: 'analyze', label: 'Analyze Jobs', status: 'waiting', detail: 'Waiting for job descriptions' },
  { id: 'score', label: 'Calculate Match Score', status: 'waiting', detail: 'Waiting for AI matcher' },
  { id: 'ats', label: 'Generate ATS Guidance', status: 'waiting', detail: 'Waiting for top matches' },
  { id: 'email', label: 'Generate Email', status: 'waiting', detail: 'Waiting for resume versions' },
  { id: 'send', label: 'Send Email', status: 'waiting', detail: 'Waiting for Gmail SMTP' },
  { id: 'logs', label: 'Save Logs', status: 'waiting', detail: 'Waiting for run result' }
];

export const parseSteps = [
  ['resume', 'Uploading PDF to CareerPilot'],
  ['extract', 'Reading resume text with pdf-parse'],
  ['skills', 'Extracting skills and career signals']
] as const;

export const runSteps = [
  ['fetch', 'Searching Google Jobs with your domains and locations'],
  ['analyze', 'Reading job descriptions and requirements'],
  ['score', 'Calculating match scores and missing skills'],
  ['ats', 'Generating ATS keyword guidance for top matches'],
  ['email', 'Creating personalized recommendation email'],
  ['send', 'Sending email using Gmail SMTP from .env'],
  ['logs', 'Saving automation logs and artifacts to Firestore']
] as const;

export const completedDetails: Record<string, string> = {
  fetch: 'Google Jobs search completed',
  analyze: 'Job descriptions analyzed',
  score: 'Match scores calculated',
  ats: 'ATS keyword guides generated',
  email: 'Recommendation email generated',
  send: 'Email delivery completed',
  logs: 'Automation logs saved'
};

export function setNodeStatus(nodes: AutomationNode[], id: string, status: PipelineStatus, detail: string) {
  return nodes.map((node) => (node.id === id ? { ...node, status, detail } : node));
}

export function createReadyPipeline() {
  return initialPipelineNodes.map((node) =>
    ['resume', 'extract', 'skills'].includes(node.id)
      ? { ...node, status: 'completed' as PipelineStatus, detail: node.id === 'resume' ? 'Saved resume ready' : node.id === 'extract' ? 'Resume text already extracted' : 'Profile signals ready' }
      : node
  );
}

export function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
