import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  user: User | MockUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const hasFirebaseConfig = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

function createDemoUser(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return {
    uid: `demo-user:${normalizedEmail}`,
    email: normalizedEmail,
    displayName: 'Demo User'
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      const email = localStorage.getItem('careerpilot_demo_user');
      if (email) setUser(createDemoUser(email));
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        if (!hasFirebaseConfig) {
          localStorage.setItem('careerpilot_demo_user', email);
          setUser(createDemoUser(email));
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
      },
      register: async (email, password) => {
        if (!hasFirebaseConfig) {
          localStorage.setItem('careerpilot_demo_user', email);
          setUser(createDemoUser(email));
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      },
      logout: async () => {
        if (!hasFirebaseConfig) {
          localStorage.removeItem('careerpilot_demo_user');
          setUser(null);
          return;
        }
        await signOut(auth);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
