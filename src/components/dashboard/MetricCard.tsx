import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
}

export function MetricCard({ label, value, trend, icon: Icon }: MetricCardProps) {
  return (
    <div className="glass rounded-[8px] p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-signal/12 text-signal">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-[8px] bg-white/8 px-3 py-1 text-xs font-bold text-white/60">{trend}</span>
      </div>
      <p className="mt-8 text-sm text-white/50">{label}</p>
      <h3 className="mt-2 font-display text-4xl font-bold text-white">{value}</h3>
    </div>
  );
}
