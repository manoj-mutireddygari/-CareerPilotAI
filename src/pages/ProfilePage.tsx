import { UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="glass max-w-3xl rounded-[8px] p-6">
      <UserRound className="h-10 w-10 text-signal" />
      <h2 className="mt-5 font-display text-3xl font-bold text-white">Profile</h2>
      <div className="mt-6 space-y-4">
        <div className="rounded-[8px] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Email</p>
          <p className="mt-2 font-bold text-white">{user?.email}</p>
        </div>
        <div className="rounded-[8px] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-white/42">Agent</p>
          <p className="mt-2 font-bold text-white">CareerPilot AI Daily Automation</p>
        </div>
      </div>
    </section>
  );
}
