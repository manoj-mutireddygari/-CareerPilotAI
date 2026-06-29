import {
  Activity,
  BellRing,
  BrainCircuit,
  Check,
  FileStack,
  Gauge,
  History,
  Mail,
  Radar,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  UploadCloud
} from 'lucide-react';
import { consoleLines, workflowNodes } from '../../data/mockData';
import { SectionTitle } from './SectionTitle';

const stats = [
  ['Jobs Processed', '128K+'],
  ['ATS Optimization Rate', '94%'],
  ['Automation Success Rate', '98%'],
  ['Emails Delivered', '41K+'],
  ['Companies Covered', '9.6K+']
];

const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Adobe', 'Oracle', 'IBM', 'TCS', 'Infosys', 'Zoho', 'Freshworks'];

const features = [
  ['Resume Analysis', BrainCircuit],
  ['AI Matching', Radar],
  ['ATS Optimization', ShieldCheck],
  ['Daily Automation', Activity],
  ['Job Discovery', Search],
  ['Resume Versions', FileStack],
  ['Email Automation', Mail],
  ['Automation Logs', History],
  ['Skill Gap Analysis', Gauge],
  ['Career Intelligence', TrendingUp]
];

export function StatsSection() {
  return (
    <section className="border-y border-white/10 bg-black/20 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} data-counter className="glass rounded-[8px] p-5 text-center">
            <div className="font-display text-3xl font-bold text-white md:text-4xl">{value}</div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LogoMarquee() {
  return (
    <section className="overflow-hidden py-14">
      <div className="flex w-[200%] animate-marquee gap-4">
        {[...companies, ...companies].map((company, index) => (
          <div
            key={`${company}-${index}`}
            className="grid h-20 min-w-44 place-items-center rounded-[8px] border border-white/10 bg-white/[0.045] font-display text-lg font-bold text-white/72"
          >
            {company}
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProblemSection() {
  const items = ['Searching Jobs', 'Reading Descriptions', 'Editing Resume', 'Checking ATS', 'Applying', 'Repeating Tomorrow'];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker="The Loop"
          title="Job searching is a daily operating burden."
          copy="CareerPilot collapses the repetitive parts into one autonomous agent that keeps moving while you study, build, and interview."
        />
        <div className="mt-16 grid gap-4 md:grid-cols-6">
          {items.map((item, index) => (
            <div key={item} data-reveal className="problem-card glass rounded-[8px] p-5">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[8px] bg-ember/15 text-ember">{index + 1}</div>
              <h3 className="font-display text-xl font-bold text-white">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">Manual effort, context switching, and missed timing.</p>
            </div>
          ))}
        </div>
        <div data-reveal className="mx-auto mt-10 max-w-xl rounded-[8px] border border-signal/35 bg-signal/10 p-8 text-center shadow-glow">
          <BrainCircuit className="mx-auto h-10 w-10 text-signal" />
          <h3 className="mt-4 font-display text-3xl font-bold text-white">One AI Agent Does Everything</h3>
        </div>
      </div>
    </section>
  );
}

export function InteractiveWorkflow() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(80,227,194,0.08),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker="Autonomous Pipeline"
          title="A career agent that behaves like infrastructure."
          copy="Upload once. The parser, matcher, optimizer, and email agent coordinate every day with visible state and audit logs."
        />
        <div className="mt-16 overflow-x-auto pb-4">
          <div className="relative flex min-w-[1120px] items-center gap-5">
            <div className="absolute left-16 right-16 top-1/2 h-px bg-gradient-to-r from-signal via-solar to-ember" />
            {workflowNodes.map((node, index) => {
              const Icon = [UploadCloud, FileStack, Sparkles, Search, Radar, ShieldCheck, Mail, Check][index];
              return (
                <div key={node} data-reveal className="workflow-step glass relative z-10 w-36 rounded-[8px] p-4 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-white/10 text-signal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-white">{node}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureCards() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker="Agent Capabilities"
          title="Everything a job seeker repeats, automated into one system."
          copy="Each feature feeds the next: resume understanding, job intelligence, ATS optimization, email delivery, and transparent logs."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map(([label, Icon]) => (
            <div key={label as string} data-reveal className="group glass rounded-[8px] p-5 transition hover:-translate-y-1 hover:border-signal/35">
              <Icon className="h-8 w-8 text-solar transition group-hover:scale-110" />
              <h3 className="mt-8 font-display text-xl font-bold text-white">{label as string}</h3>
              <p className="mt-3 text-sm leading-6 text-white/52">Designed as a real automation primitive, not a static checklist.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardShowcase() {
  return (
    <section id="demo" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker="Dashboard Preview"
          title="A command center for your AI career operations."
          copy="Watch jobs, match scores, generated resumes, live logs, and the next scheduled run in one premium dashboard."
        />
        <div data-reveal className="mx-auto mt-16 max-w-6xl rounded-[8px] border border-white/15 bg-[#111] p-3 shadow-2xl">
          <div className="rounded-[8px] border border-white/10 bg-[#050505] p-5">
            <div className="mb-5 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
              <div className="space-y-4">
                {['Automation Running', '42 Jobs Checked Today', '9 Matched Jobs', '3 Resumes Generated'].map((item) => (
                  <div key={item} className="rounded-[8px] border border-white/10 bg-white/[0.055] p-4">
                    <p className="text-sm text-white/55">{item}</p>
                    <div className="mt-3 h-2 rounded-full bg-white/10">
                      <div className="h-full w-3/4 rounded-full bg-signal" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
                <div className="flex h-64 items-end gap-3">
                  {[40, 72, 52, 88, 64, 94, 76, 84].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-[8px] bg-gradient-to-t from-signal to-solar"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {['Emails Sent', 'Next Run', 'Match Quality'].map((item) => (
                    <div key={item} className="rounded-[8px] bg-black/35 p-3 text-sm text-white/60">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LiveAutomationShowcase() {
  const nodes = ['Waiting', 'Running', 'Completed', 'Completed', 'Completed'];
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          kicker="Execution View"
          title="Automation you can watch like n8n."
          copy="Every node reports state, connections animate while work is running, and completed steps leave an audit trail."
        />
        <div data-reveal className="mt-16 grid gap-4 md:grid-cols-5">
          {nodes.map((state, index) => (
            <div key={`${state}-${index}`} className="glass rounded-[8px] p-5">
              <div className={`mb-5 h-3 rounded-full ${state === 'Running' ? 'animate-pulse bg-skyglass' : state === 'Completed' ? 'bg-signal' : 'bg-white/20'}`} />
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Step {index + 1}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{state}</h3>
              {state === 'Completed' && <Check className="mt-5 h-7 w-7 text-signal" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TerminalConsoleSection() {
  return (
    <section className="py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div data-reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-signal">Live Console</p>
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">Your agent narrates every move.</h2>
          <p className="mt-5 text-lg leading-8 text-white/62">The console turns background automation into a transparent, inspectable workflow.</p>
        </div>
        <div data-reveal className="glass rounded-[8px] p-5 font-mono text-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4 text-white/45">
            <Terminal className="h-4 w-4" />
            careerpilot-agent.log
          </div>
          <div className="space-y-3">
            {consoleLines.map((line, index) => (
              <p key={line} className="console-line text-signal" style={{ animationDelay: `${index * 0.45}s` }}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsAndCta() {
  const quotes = [
    ['CareerPilot found three strong-fit roles before I opened LinkedIn.', 'Ananya, ML Student'],
    ['The resume rewrites were sharper than what I was doing manually.', 'Rohit, Backend Developer'],
    ['It finally made job search feel like a system instead of panic.', 'Maya, Data Analyst']
  ];
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 md:grid-cols-3">
          {quotes.map(([quote, author]) => (
            <div key={author} data-reveal className="glass rounded-[8px] p-6">
              <p className="text-lg leading-8 text-white/75">"{quote}"</p>
              <p className="mt-6 text-sm font-bold text-signal">{author}</p>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-24 rounded-[8px] border border-white/10 bg-mist p-8 text-center text-ink md:p-16">
          <h2 className="font-display text-5xl font-bold leading-tight md:text-7xl">Stop Searching.<br />Start Automating.</h2>
          <a href="/login" className="mt-8 inline-flex min-h-14 items-center rounded-[8px] bg-ink px-7 font-bold text-mist">Start Automation</a>
        </div>
      </div>
    </section>
  );
}
