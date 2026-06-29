import { useEffect, useState } from 'react';
import { JobCard } from '../components/dashboard/JobCard';
import { useToast } from '../context/ToastContext';
import { fetchMatchedJobs } from '../lib/api';
import type { JobMatch } from '../types/domain';

export function JobsPage() {
  const { notify } = useToast();
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchedJobs()
      .then((response) => setJobs(response.jobs))
      .catch((error) => notify('error', error instanceof Error ? error.message : 'Unable to load matched jobs.'))
      .finally(() => setLoading(false));
  }, [notify]);

  return (
    <div className="space-y-5 pb-20">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-signal">Matched Jobs</p>
        <h2 className="mt-2 font-display text-4xl font-bold text-white">Top opportunities above 80%</h2>
      </div>
      {jobs.length ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      ) : (
        <div className="glass rounded-[8px] p-8 text-center text-white/58">
          {loading ? 'Loading matched jobs...' : 'No matched jobs yet. Run automation to collect real recommendations.'}
        </div>
      )}
    </div>
  );
}
