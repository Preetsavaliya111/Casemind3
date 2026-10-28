import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { TEAM_USERS } from '../data/mockIncidents';
import { Lock, UserPlus, X, Check, AlertCircle, ArrowRight, Shield, Sparkles, Globe } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  currentUser: UserProfile | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  currentUser
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTeam, setSignupTeam] = useState('Tier-3 Support');
  const [signupError, setSignupError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = (user: UserProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(user);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLogin(user);
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setLoginError(err?.message || 'Google Sign-In failed or popup was closed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your work email and password.');
      return;
    }

    if (!loginEmail.includes('@')) {
      setLoginError('Please provide a valid corporate email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check if user exists in directory
      const found = TEAM_USERS.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (found) {
        onLogin(found);
        setIsLoading(false);
        onClose();
      } else {
        // Fallback login with AGENT role for valid email
        const fallbackUser: UserProfile = {
          id: `usr-${Date.now()}`,
          name: loginEmail.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: loginEmail.trim(),
          role: 'AGENT',
          team: 'Incident Engineering',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          activeSince: 'Just joined'
        };
        onLogin(fallbackUser);
        setIsLoading(false);
        onClose();
      }
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName.trim() || signupName.trim().length < 3) {
      setSignupError('Full name must be at least 3 characters.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Please provide a valid corporate email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: signupName.trim(),
        email: signupEmail.trim(),
        role: 'AGENT', // Default safe role for new accounts; only Admin can escalate to Manager/Admin
        team: signupTeam.trim() || 'Tier-3 Support',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        activeSince: 'New Account'
      };

      onRegister(newUser);
      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 selection:bg-[#4f46e5] selection:text-white">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#dae2fd] space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#3525cd] to-[#7c3aed] flex items-center justify-center text-white shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#131b2e] leading-snug">
                {authMode === 'LOGIN' ? 'Sign In to CaseMind' : 'Create CaseMind Account'}
              </h3>
              <p className="text-xs text-[#464555]">
                Enterprise Single-Sign-On & Role-Based Authentication
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777587] hover:bg-[#f2f3ff] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#f2f3ff] p-1 border border-[#c7c4d8]">
          <button
            onClick={() => { setAuthMode('LOGIN'); setLoginError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'LOGIN' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('SIGNUP'); setSignupError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === 'SIGNUP' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#464555] hover:text-[#131b2e]'
            }`}
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* Quick Demo Role Selector (1-Click Login) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#464555] uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#7c3aed]" />
              Quick Demo Sign-In (Select Role)
            </span>
            <span className="text-[10px] text-[#059669] font-mono font-semibold">Instant Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {TEAM_USERS.slice(0, 4).map((usr) => {
              const isCurrent = currentUser?.id === usr.id;
              return (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleDemoLogin(usr)}
                  disabled={isLoading}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2.5 ${
                    isCurrent
                      ? 'border-[#3525cd] bg-[#eaedff]/60 ring-2 ring-[#c3c0ff]'
                      : 'border-[#dae2fd] bg-[#faf8ff] hover:bg-white hover:border-[#3525cd]'
                  }`}
                >
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#dae2fd]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#131b2e] truncate">{usr.name}</p>
                    <span className={`text-[10px] font-mono font-bold block ${
                      usr.role === 'ADMIN' ? 'text-[#7c3aed]' : usr.role === 'MANAGER' ? 'text-[#3525cd]' : usr.role === 'AGENT' ? 'text-[#059669]' : 'text-[#777587]'
                    }`}>
                      {usr.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Real Firebase Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center justify-center space-x-2.5 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google (Firebase Auth)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#eaedff] w-full" />
          <span className="bg-white px-3 text-[11px] font-mono text-[#777587] uppercase shrink-0">
            Or continue with credentials
          </span>
          <div className="border-t border-[#eaedff] w-full" />
        </div>

        {/* LOGIN FORM */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#ba1a1a] flex items-center space-x-1.5 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                Corporate Email
              </label>
              <input
                type="email"
                placeholder="e.g., e.rostova@enterprise.corp"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {authMode === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="space-y-4">
            {signupError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-[#ba1a1a] flex items-center space-x-1.5 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Alex Mercer"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                placeholder="e.g., alex.mercer@enterprise.corp"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e] placeholder-[#777587] focus:ring-2 focus:ring-[#3525cd] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#464555] uppercase font-mono block mb-1">
                  Team / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ingress SRE"
                  value={signupTeam}
                  onChange={(e) => setSignupTeam(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f2f3ff] border border-[#c7c4d8] rounded-xl text-xs text-[#131b2e]"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#faf8ff] border border-[#dae2fd] text-[11px] text-[#464555] space-y-1">
              <span className="font-bold text-[#131b2e] flex items-center">
                <Shield className="w-3.5 h-3.5 mr-1 text-[#3525cd]" />
                Role-Based Security Policy
              </span>
              <p>
                New registrations are granted <strong>AGENT</strong> privileges by default. Role escalation to Manager or Administrator must be authorized by an active tenant Administrator.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3525cd] hover:bg-[#4f46e5] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Creating Account...' : 'Register & Enter Workspace'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
