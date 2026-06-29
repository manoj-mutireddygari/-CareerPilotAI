import { CheckCircle2, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4800);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[100] w-[min(420px,calc(100vw-32px))] space-y-3">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : XCircle;
          return (
            <div
              key={toast.id}
              className={`glass rounded-[8px] p-4 shadow-2xl ${
                toast.type === 'success' ? 'border-signal/35 bg-signal/10' : 'border-ember/35 bg-ember/10'
              }`}
            >
              <div className="flex gap-3">
                <Icon className={`mt-0.5 h-5 w-5 ${toast.type === 'success' ? 'text-signal' : 'text-ember'}`} />
                <p className="text-sm font-semibold leading-6 text-white">{toast.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside ToastProvider');
  return value;
}
