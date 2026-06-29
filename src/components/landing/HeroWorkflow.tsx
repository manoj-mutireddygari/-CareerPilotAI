import { BrainCircuit, CheckCircle2, FileText, Mail, Search, Sparkles } from 'lucide-react';

const nodes = [
  { label: 'Resume', icon: FileText, detail: 'Parsed once' },
  { label: 'AI Brain', icon: BrainCircuit, detail: 'Understands you' },
  { label: 'Google Jobs', icon: Search, detail: 'Scans daily' },
  { label: 'Optimization', icon: Sparkles, detail: 'ATS ready' },
  { label: 'Email', icon: Mail, detail: 'Delivered' },
  { label: 'Success', icon: CheckCircle2, detail: 'Actionable' }
];

export function HeroWorkflow() {
  return (
    <div className="relative mx-auto h-[560px] max-w-[520px] lg:mx-0">
      <div className="absolute inset-0 rounded-[8px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.035))] shadow-glow backdrop-blur-3xl" />
      <div className="absolute inset-4 overflow-hidden rounded-[8px] border border-white/10 bg-black/30">
        <div className="premium-grid absolute inset-0 opacity-70" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 560" fill="none">
          <path
            className="workflow-path"
            d="M260 84 C176 126 174 190 260 224 C346 258 346 322 260 356 C174 390 174 454 260 498"
            stroke="url(#line)"
            strokeWidth="3"
            strokeDasharray="10 14"
          />
          <defs>
            <linearGradient id="line" x1="120" y1="80" x2="400" y2="500">
              <stop stopColor="#50E3C2" />
              <stop offset="0.5" stopColor="#F6C445" />
              <stop offset="1" stopColor="#FF7A3D" />
            </linearGradient>
          </defs>
        </svg>
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const positions = [
            'left-[24%] top-[7%]',
            'right-[13%] top-[21%]',
            'left-[12%] top-[36%]',
            'right-[10%] top-[51%]',
            'left-[18%] top-[66%]',
            'right-[19%] top-[81%]'
          ];
          return (
            <div
              key={node.label}
              className={`workflow-card glass absolute ${positions[index]} w-52 rounded-[8px] p-4`}
              style={{ animationDelay: `${index * 0.35}s` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-signal/15 text-signal">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold text-white">{node.label}</span>
                  <span className="text-xs text-white/55">{node.detail}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute -bottom-5 left-8 right-8 glass rounded-[8px] p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/50">
          <span>Agent Status</span>
          <span className="text-signal">Running</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-signal via-solar to-ember" />
        </div>
      </div>
    </div>
  );
}
