import { Router } from 'express';
import {
  createAutomationSetting,
  deleteAutomationSetting,
  getAutomationSetting,
  listAutomationSettings,
  updateAutomationSetting
} from '../services/automationSettings.service';
import { runAutomation } from '../services/automation.service';
import type { AutomationRequest } from '../types';

export const automationRouter = Router();

automationRouter.get('/settings', async (req, res) => {
  const userId = String(req.query.userId || 'demo-user');
  const automations = await listAutomationSettings(userId);
  res.json({ automations });
});

automationRouter.post('/settings', async (req, res) => {
  const body = req.body as Partial<AutomationRequest>;
  if (!body.recipientEmail) {
    res.status(400).json({ error: 'Recipient email is required' });
    return;
  }

  const result = await createAutomationSetting({
    userId: body.userId || 'demo-user',
    name: body.name,
    recipientEmail: body.recipientEmail,
    domains: body.domains?.length ? body.domains : ['AI Engineer'],
    locations: body.locations?.length ? body.locations : ['Remote'],
    expectedSalary: body.expectedSalary,
    experienceLevel: body.experienceLevel,
    automationTime: body.automationTime || '20:00'
  });
  res.json(result);
});

automationRouter.put('/settings/:id', async (req, res) => {
  const body = req.body as Partial<AutomationRequest>;
  if (!body.recipientEmail) {
    res.status(400).json({ error: 'Recipient email is required' });
    return;
  }

  try {
    await updateAutomationSetting(req.params.id, {
      userId: body.userId || 'demo-user',
      name: body.name,
      recipientEmail: body.recipientEmail,
      domains: body.domains?.length ? body.domains : ['AI Engineer'],
      locations: body.locations?.length ? body.locations : ['Remote'],
      expectedSalary: body.expectedSalary,
      experienceLevel: body.experienceLevel,
      automationTime: body.automationTime || '20:00'
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(409).json({ error: error instanceof Error ? error.message : 'Unable to update automation' });
  }
});

automationRouter.delete('/settings/:id', async (req, res) => {
  await deleteAutomationSetting(req.params.id);
  res.json({ ok: true });
});

automationRouter.post('/run', async (req, res) => {
  const body = req.body as Partial<AutomationRequest>;
  let request: AutomationRequest | null = null;

  if (body.automationId) {
    const saved = await getAutomationSetting(body.automationId);
    if (!saved) {
      res.status(404).json({ error: 'Saved automation was not found' });
      return;
    }
    request = { ...saved, automationId: body.automationId };
  }

  if (!request && !body.recipientEmail) {
    res.status(400).json({ error: 'Recipient email is required' });
    return;
  }

  const result = await runAutomation(
    request || {
      userId: body.userId || 'demo-user',
      name: body.name,
      recipientEmail: body.recipientEmail || '',
      domains: body.domains?.length ? body.domains : ['AI Engineer'],
      locations: body.locations?.length ? body.locations : ['Remote'],
      expectedSalary: body.expectedSalary,
      experienceLevel: body.experienceLevel,
      automationTime: body.automationTime || '20:00'
    }
  );

  if (result.errors.length > 0) {
    res.status(422).json({ result, error: result.errors[0] });
    return;
  }

  res.json({ result });
});
