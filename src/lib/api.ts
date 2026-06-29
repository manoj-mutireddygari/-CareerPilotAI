import type { AutomationLog, JobMatch } from '../types/domain';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export interface RunAutomationPayload {
  userId: string;
  automationId?: string;
  name?: string;
  recipientEmail: string;
  domains: string[];
  locations: string[];
  expectedSalary?: string;
  experienceLevel?: string;
  automationTime?: string;
  signature?: string;
}

export interface SavedAutomation {
  id: string;
  userId: string;
  name?: string;
  recipientEmail: string;
  domains: string[];
  locations: string[];
  expectedSalary?: string;
  experienceLevel?: string;
  automationTime?: string;
  signature?: string;
  createdAt?: string;
  updatedAt?: string;
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

export function uploadResume(userId: string, file: File) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('resume', file);
  return request<{ profile: unknown }>('/resume/upload', { method: 'POST', body: formData });
}

export function runAutomation(payload: RunAutomationPayload) {
  return request<{ result: AutomationRunResult }>('/automation/run', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function runSavedAutomation(userId: string, automationId: string) {
  return request<{ result: AutomationRunResult }>('/automation/run', {
    method: 'POST',
    body: JSON.stringify({ userId, automationId })
  });
}

export function fetchSavedAutomations(userId: string) {
  return request<{ automations: SavedAutomation[] }>(`/automation/settings?userId=${encodeURIComponent(userId)}`);
}

export function createSavedAutomation(payload: RunAutomationPayload) {
  return request<{ id: string; duplicate?: boolean }>('/automation/settings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateSavedAutomation(id: string, payload: RunAutomationPayload) {
  return request<{ ok: true }>(`/automation/settings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteSavedAutomation(id: string) {
  return request<{ ok: true }>(`/automation/settings/${id}`, { method: 'DELETE' });
}

export function fetchLogs() {
  return request<{ logs: AutomationLog[] }>('/logs');
}

export function fetchMatchedJobs() {
  return request<{ jobs: JobMatch[] }>('/jobs/matched');
}

export function fetchResumeVersions() {
  return request<{ versions: Array<Record<string, unknown>> }>('/resume-versions');
}

export function fetchEmails() {
  return request<{ emails: Array<Record<string, unknown>> }>('/emails');
}
