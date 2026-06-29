import { BellRing, KeyRound, Mail, Shield } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="grid gap-5 pb-20 md:grid-cols-2">
      {[
        ['Firebase Authentication', Shield],
        ['Gmail SMTP', Mail],
        ['OpenAI or Gemini API', KeyRound],
        ['Daily Notifications', BellRing]
      ].map(([label, Icon]) => (
        <section key={label as string} className="glass rounded-[8px] p-6">
          <Icon className="h-8 w-8 text-signal" />
          <h2 className="mt-5 font-display text-2xl font-bold text-white">{label as string}</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Configure environment variables and secrets for production deployment.</p>
        </section>
      ))}
    </div>
  );
}
