import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-mist">
        <div className="glass rounded-[8px] px-6 py-4 text-sm text-white/70">Initializing CareerPilot AI...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
