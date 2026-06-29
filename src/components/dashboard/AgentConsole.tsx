import { Terminal } from 'lucide-react';

export function AgentConsole({ lines = [] }: { lines?: string[] }) {
  const displayLines = lines.length ? lines : ['Waiting for your first automation run...'];

  return (
    <div className="glass rounded-[8px] p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4 text-sm text-white/50">
        <Terminal className="h-4 w-4 text-signal" />
        Live Activity Console
      </div>
      <div className="space-y-3 font-mono text-sm">
        {displayLines.map((line, index) => (
          <p key={line} className="console-line text-signal" style={{ animationDelay: `${index * 0.3}s` }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
