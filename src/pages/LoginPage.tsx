import { Bot, Mail, Lock, Sparkles } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-ink px-6 py-10 text-mist">
      <div className="aurora absolute inset-x-0 top-0 mx-auto h-[520px] max-w-5xl opacity-70" />
      <div className="premium-grid absolute inset-0 opacity-40" />
      <div className="relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-center">
        <div>
          <div className="mb-8 inline-flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/8 px-4 py-3">
            <Bot className="h-5 w-5 text-signal" />
            <span className="font-display font-bold text-white">CareerPilot AI</span>
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">Assign your career agent.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Sign in to upload your resume, configure daily automation, watch pipeline runs, and receive high-match opportunities.
          </p>
        </div>
        <form onSubmit={submit} className="glass rounded-[8px] p-6 md:p-8">
          <Sparkles className="mb-5 h-9 w-9 text-solar" />
          <h2 className="font-display text-3xl font-bold text-white">{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p className="mt-2 text-sm text-white/55">Use your Firebase Authentication account to continue.</p>
          <label className="mt-8 block text-sm font-bold text-white/70">Email</label>
          <div className="mt-2 flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/25 px-4">
            <Mail className="h-4 w-4 text-white/38" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full bg-transparent text-white outline-none" />
          </div>
          <label className="mt-5 block text-sm font-bold text-white/70">Password</label>
          <div className="mt-2 flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/25 px-4">
            <Lock className="h-4 w-4 text-white/38" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full bg-transparent text-white outline-none" />
          </div>
          {error && <p className="mt-4 rounded-[8px] bg-ember/12 p-3 text-sm text-ember">{error}</p>}
          <button disabled={loading} className="mt-7 min-h-12 w-full rounded-[8px] bg-mist font-bold text-ink disabled:opacity-60">
            {loading ? 'Starting agent...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 w-full text-sm font-bold text-signal">
            {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </form>
      </div>
    </main>
  );
}
