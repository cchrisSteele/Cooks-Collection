import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { endpoints } from '../lib/api';
import type { AuthCredentials, AuthMode, SignUpCredentials, User } from '../types/models';

const DEMO_SESSION_KEY = 'cooks-collection-demo-session-v1';
const DEMO_USER: User = { id: 'demo-user', name: 'Home Cook', email: 'demo@cookscollection.local' };

interface AuthContextValue {
  user: User | null;
  mode: AuthMode;
  checking: boolean;
  signIn: (values: AuthCredentials) => Promise<User>;
  signUp: (values: SignUpCredentials) => Promise<User>;
  signOut: () => Promise<void>;
  enterDemo: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function existingDemo(): User | null {
  try { return sessionStorage.getItem(DEMO_SESSION_KEY) === 'true' ? DEMO_USER : null; }
  catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(existingDemo);
  const [mode, setMode] = useState<AuthMode>(() => existingDemo() ? 'demo' : 'real');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (existingDemo()) { setChecking(false); return; }
    let active = true;
    endpoints.me().then(data => { if (active) setUser(data?.user || null); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);

  async function signIn(values: AuthCredentials): Promise<User> {
    const data = await endpoints.signIn(values);
    const authenticatedUser = 'user' in data ? data.user : data;
    if (!authenticatedUser?.id && !authenticatedUser?.user_id) throw new Error('The backend did not return a user record.');
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setMode('real'); setUser(authenticatedUser);
    return authenticatedUser;
  }

  async function signUp(values: SignUpCredentials): Promise<User> {
    const data = await endpoints.signUp(values);
    const authenticatedUser = 'user' in data ? data.user : data;
    if (!authenticatedUser?.id && !authenticatedUser?.user_id) throw new Error('The backend did not return a user record.');
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setMode('real'); setUser(authenticatedUser);
    return authenticatedUser;
  }

  function enterDemo(): void {
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
    setMode('demo'); setUser(DEMO_USER); setChecking(false);
  }

  async function signOut(): Promise<void> {
    if (mode === 'real') {
      try { await endpoints.signOut(); } catch { /* Allow local navigation even if API is offline. */ }
    }
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null); setMode('real');
  }

  return <AuthContext.Provider value={{ user, mode, checking, signIn, signUp, signOut, enterDemo }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
