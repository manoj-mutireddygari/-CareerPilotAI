import cron from 'node-cron';
import { runAutomation } from '../services/automation.service';

let schedulerStarted = false;

export function startScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;

  cron.schedule('0 20 * * *', async () => {
    if (!process.env.DEFAULT_RECIPIENT_EMAIL) return;

    await runAutomation({
      userId: 'demo-user',
      recipientEmail: process.env.DEFAULT_RECIPIENT_EMAIL,
      domains: (process.env.DEFAULT_JOB_DOMAINS || 'AI Engineer,Full Stack Developer').split(',').map((item) => item.trim()),
      locations: (process.env.DEFAULT_JOB_LOCATIONS || 'Remote').split(',').map((item) => item.trim()),
      automationTime: '20:00'
    });
  });
}
