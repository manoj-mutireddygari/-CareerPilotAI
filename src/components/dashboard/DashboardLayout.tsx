import { Activity, BarChart3, Bot, BriefcaseBusiness, History, LogOut, Play, Settings, UserRound, Workflow } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PipelineRunnerModal } from './PipelineRunnerModal';

const navItems = [
  ['Dashboard', '/dashboard', BarChart3],
  ['Automation', '/dashboard/automation', Workflow],
  ['Jobs', '/dashboard/jobs', BriefcaseBusiness],
  ['Logs', '/dashboard/logs', History],
  ['Settings', '/dashboard/settings', Settings],
  ['Profile', '/dashboard/profile', UserRound]
];

export function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [runSignal, setRunSignal] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openLivePipeline = () => {
    setPipelineOpen(true);
  };

  const runFromHeader = () => {
    setPipelineOpen(true);
    setRunSignal((current) => current + 1);
  };

  return (
    <div className="min-h-screen bg-ink text-mist">
      <div className="premium-grid fixed inset-0 opacity-30" />
      <aside className="fixed bottom-0 left-0 top-0 z-20 hidden w-72 border-r border-white/10 bg-black/35 p-5 backdrop-blur-2xl lg:block">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-signal/15 text-signal"><Bot className="h-6 w-6" /></span>
          <div>
            <p className="font-display text-xl font-bold text-white">CareerPilot AI</p>
            <p className="text-xs text-white/45">Agent Command Center</p>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map(([label, path, Icon]) => (
            <NavLink
              key={path as string}
              to={path as string}
              end={path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-mist text-ink' : 'text-white/62 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label as string}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-[8px] border border-white/10 px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/8"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
      <main className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-ink/70 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-signal">Automation online</p>
              <h1 className="font-display text-2xl font-bold text-white">Good evening, {user?.displayName || user?.email?.split('@')[0] || 'Pilot'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={openLivePipeline} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/8">
                <Activity className="h-4 w-4 text-signal" />
                Live
              </button>
              <button onClick={runFromHeader} className="inline-flex items-center gap-2 rounded-[8px] bg-mist px-4 py-2 text-sm font-bold text-ink">
                <Play className="h-4 w-4" />
                Run Automation Now
              </button>
            </div>
          </div>
        </header>
        <div className="dashboard-scroll min-h-[calc(100vh-81px)] px-5 py-8 lg:px-8">
          <Outlet />
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-white/10 bg-ink/90 p-2 backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 5).map(([label, path, Icon]) => (
          <NavLink key={path as string} to={path as string} end={path === '/dashboard'} className="grid place-items-center gap-1 rounded-[8px] px-2 py-2 text-[10px] text-white/60">
            <Icon className="h-4 w-4" />
            {label as string}
          </NavLink>
        ))}
      </nav>
      <PipelineRunnerModal open={pipelineOpen} runSignal={runSignal} onClose={() => setPipelineOpen(false)} />
    </div>
  );
}
