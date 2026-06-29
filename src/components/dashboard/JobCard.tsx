import { ExternalLink, Sparkles } from 'lucide-react';
import type { JobMatch } from '../../types/domain';

export function JobCard({ job }: { job: JobMatch }) {
  return (
    <article className="glass rounded-[8px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-signal">{job.company}</p>
          <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-white">{job.role}</h3>
          <p className="mt-2 text-sm text-white/50">{job.location} · {job.salary} · {job.postedDate}</p>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-[8px] bg-signal/12 font-display text-xl font-bold text-signal">
          {job.matchScore}%
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-white/62">{job.recommendation || job.whyItMatches || 'Matched by CareerPilot AI.'}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {job.missingSkills.map((skill) => (
          <span key={skill} className="rounded-[8px] bg-ember/12 px-3 py-1 text-xs font-bold text-ember">{skill}</span>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <a href={job.applyLink} className="inline-flex items-center gap-2 rounded-[8px] bg-mist px-4 py-2 text-sm font-bold text-ink">
          Apply <ExternalLink className="h-4 w-4" />
        </a>
        <button className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 px-4 py-2 text-sm font-bold text-white/70">
          Generate Resume <Sparkles className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
