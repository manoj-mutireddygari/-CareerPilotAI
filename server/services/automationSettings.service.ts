import type { AutomationRequest } from '../types';
import { deleteDocument, getDocument, listCollectionWhere, saveCollectionItem, updateDocument } from './storage.service';

export interface SavedAutomation extends AutomationRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeList(items: string[]) {
  return items.map((item) => item.trim().toLowerCase()).filter(Boolean).sort().join('|');
}

function automationSignature(data: Pick<AutomationRequest, 'recipientEmail' | 'domains' | 'locations' | 'expectedSalary' | 'experienceLevel' | 'automationTime'>) {
  return [
    data.recipientEmail.trim().toLowerCase(),
    normalizeList(data.domains),
    normalizeList(data.locations),
    (data.expectedSalary || '').trim().toLowerCase(),
    (data.experienceLevel || '').trim().toLowerCase(),
    data.automationTime || '20:00'
  ].join('::');
}

export async function createAutomationSetting(data: AutomationRequest) {
  const signature = automationSignature(data);
  const existing = await listAutomationSettings(data.userId);
  const duplicate = existing.find((automation) => automation.signature === signature);

  if (duplicate) {
    return { id: duplicate.id, duplicate: true };
  }

  const id = await saveCollectionItem('automation_settings', {
    ...data,
    name: data.name || data.domains[0] || 'Career automation',
    signature,
    updatedAt: new Date().toISOString()
  });
  return { id, duplicate: false };
}

export async function listAutomationSettings(userId: string) {
  return listCollectionWhere('automation_settings', 'userId', userId, 50) as Promise<SavedAutomation[]>;
}

export async function getAutomationSetting(id: string) {
  return getDocument<SavedAutomation>('automation_settings', id);
}

export async function updateAutomationSetting(id: string, data: AutomationRequest) {
  const signature = automationSignature(data);
  const existing = await listAutomationSettings(data.userId);
  const duplicate = existing.find((automation) => automation.id !== id && automation.signature === signature);

  if (duplicate) {
    throw new Error('This automation already exists. Change the role, location, email, salary, experience, or time to save another one.');
  }

  await updateDocument('automation_settings', id, {
    ...data,
    name: data.name || data.domains[0] || 'Career automation',
    signature,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteAutomationSetting(id: string) {
  await deleteDocument('automation_settings', id);
}
