import { BarChart3, Clock, FileStack, Mail, Radar, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AgentConsole } from '../components/dashboard/AgentConsole';
import { JobCard } from '../components/dashboard/JobCard';
import { MetricCard } from '../components/dashboard/MetricCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchEmails, fetchLogs, fetchMatchedJobs, fetchResumeVersions } from '../lib/api';
import type { AutomationLog, JobMatch } from '../types/domain';

interface DashboardState {
  logs: AutomationLog[];
  jobs: JobMatch[];
  resumeVersions: Array<Record<string, unknown>>;
  emails: Array<Record<string, unknown>>;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [state, setState] = useState<DashboardState>({ logs: [], jobs: [], resumeVersions: [], emails: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    const userId = user.uid;

    Promise.all([fetchLogs(userId), fetchMatchedJobs(userId), fetchResumeVersions(userId), fetchEmails(userId)])
      .then(([logs, jobs, resumeVersions, emails]) => {
        if (!mounted) return;
        setState({ logs: logs.logs, jobs: jobs.jobs, resumeVersions: resumeVersions.versions, emails: emails.emails });
      })
      .catch((error) => notify('error', error instanceof Error ? error.message : 'Unable to load dashboard data.'))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [notify, user?.uid]);

  const latestLog = state.logs[0];
  const chartData = state.logs.slice(0, 7).reverse().map((log, index) => ({
    day: `Run ${index + 1}`,
    score: state.jobs[index]?.matchScore || 0,
    jobs: log.jobsRetrieved || 0
  }));

  const consoleLines = latestLog
    ? [
        `[${new Date(latestLog.startedAt).toLocaleTimeString()}] Automation Started`,
        `[${new Date(latestLog.endedAt).toLocaleTimeString()}] ${latestLog.jobsRetrieved} Jobs Retrieved`,
        `[${new Date(latestLog.endedAt).toLocaleTimeString()}] ${latestLog.jobsMatched} Jobs Matched`,
        `[${new Date(latestLog.endedAt).toLocaleTimeString()}] ${latestLog.resumesGenerated} ATS Keyword Guides Generated`,
        `[${new Date(latestLog.endedAt).toLocaleTimeString()}] ${latestLog.emailsSent} Email Sent`,
        latestLog.errors?.length ? `Error: ${latestLog.errors[0]}` : 'Automation Completed'
      ]
    : [];

  return (
    <div className="space-y-6 pb-20">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Automation Status" value={latestLog ? 'Ready' : 'Idle'} trend={loading ? 'Loading' : latestLog ? 'Last run' : 'Setup'} icon={BarChart3} />
        <MetricCard label="Today's Jobs" value={String(latestLog?.jobsRetrieved || 0)} trend="Collected" icon={Search} />
        <MetricCard label="Jobs Matched" value={String(latestLog?.jobsMatched || 0)} trend="80%+" icon={Radar} />
        <MetricCard label="Emails Sent" value={String(state.emails.filter((email) => email.sent).length)} trend="SMTP" icon={Mail} />
        <MetricCard label="ATS Guides" value={String(state.resumeVersions.length)} trend="Keywords" icon={FileStack} />
        <MetricCard label="Next Run" value="8 PM" trend="Daily" icon={Clock} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="glass rounded-[8px] p-5">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-signal">Career Intelligence</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">Match quality trend</h2>
            </div>
          </div>
          {chartData.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
                  <YAxis stroke="rgba(255,255,255,0.4)" />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="score" stroke="#50E3C2" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="jobs" stroke="#F6C445" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grid h-80 place-items-center rounded-[8px] border border-dashed border-white/15 bg-black/20 text-center text-white/52">
              Run your first automation to generate intelligence.
            </div>
          )}
        </section>
        <AgentConsole lines={consoleLines} />
      </div>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-white">Latest recommendations</h2>
          <a href="/dashboard/jobs" className="text-sm font-bold text-signal">View all</a>
        </div>
        {state.jobs.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {state.jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="glass rounded-[8px] p-8 text-center text-white/58">No matched jobs yet. Upload a resume and run automation.</div>
        )}
      </section>
    </div>
  );
}
