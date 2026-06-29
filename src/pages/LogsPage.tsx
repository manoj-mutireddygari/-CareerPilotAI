import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { fetchLogs } from '../lib/api';
import type { AutomationLog } from '../types/domain';

export function LogsPage() {
  const { notify } = useToast();
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs()
      .then((response) => setLogs(response.logs))
      .catch((error) => notify('error', error instanceof Error ? error.message : 'Unable to load logs.'))
      .finally(() => setLoading(false));
  }, [notify]);

  return (
    <div className="space-y-5 pb-20">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-signal">Automation Logs</p>
        <h2 className="mt-2 font-display text-4xl font-bold text-white">Every run is inspectable</h2>
      </div>
      {!logs.length && (
        <div className="glass rounded-[8px] p-8 text-center text-white/58">
          {loading ? 'Loading automation logs...' : 'No automation logs yet. Your first run will appear here.'}
        </div>
      )}
      {logs.map((log, index) => (
        <details key={log.id} className="glass rounded-[8px] p-5" open={log.id === 'log-1'}>
          <summary className="cursor-pointer list-none">
            <div className="grid gap-4 md:grid-cols-6">
              <span><b className="block text-white">{new Date(log.startedAt).toLocaleTimeString()}</b><small className="text-white/45">Start</small></span>
              <span><b className="block text-white">{Math.round(log.durationMs / 1000)}s</b><small className="text-white/45">Duration</small></span>
              <span><b className="block text-white">{log.jobsRetrieved}</b><small className="text-white/45">Jobs</small></span>
              <span><b className="block text-white">{log.jobsMatched}</b><small className="text-white/45">Matched</small></span>
              <span><b className="block text-white">{log.resumesGenerated}</b><small className="text-white/45">ATS Guides</small></span>
              <span><b className="block text-white">{log.emailsSent}</b><small className="text-white/45">Emails</small></span>
            </div>
          </summary>
          <div className="mt-6 rounded-[8px] border border-white/10 bg-black/25 p-4 text-sm text-white/60">
            {log.errors?.length ? log.errors.join(', ') : `Run ${index + 1} completed successfully and saved to the backend.`}
          </div>
        </details>
      ))}
    </div>
  );
}
