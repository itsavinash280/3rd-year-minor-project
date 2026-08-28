import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import { useAuth, AVAILABLE_ROLES } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getRoleHomePath } from '../../components/common/ProtectedRoute';

export interface LoginPageProps {
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = () => {
  const {
    user,
    pendingFirebaseUser,
    loginWithGoogle,
    selectRole,
    login,
    logout,
    isLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [roleSubmitLoading, setRoleSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Email / Password Fallback Tab state
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  // If user is already authenticated with a saved role, redirect immediately to their dashboard
  useEffect(() => {
    if (user && user.role) {
      const from = (location.state as any)?.from?.pathname;
      const targetPath = from || getRoleHomePath(user.role);
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle Step 1: Real Firebase Google Sign-In
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.success) {
      if (!res.isNewUser && res.role) {
        navigate(getRoleHomePath(res.role), { replace: true });
      }
      // If res.isNewUser is true, AuthContext sets pendingFirebaseUser and Step 2 renders automatically.
    } else {
      setErrorMsg(res.message || 'Google authentication failed. Please try again.');
    }
  };

  // Handle Step 2: Role Selection Submission for New Users
  const handleRoleSelectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setRoleSubmitLoading(true);

    const res = await selectRole(selectedRole);
    setRoleSubmitLoading(false);

    if (res.success && res.role) {
      navigate(getRoleHomePath(res.role), { replace: true });
    } else {
      setErrorMsg(res.message || 'Failed to save role and create user profile.');
    }
  };

  // Handle Optional Manual Login (Staff / Email)
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setManualLoading(true);

    const res = await login(manualEmail, manualPassword);
    setManualLoading(false);

    if (res.success && res.role) {
      navigate(getRoleHomePath(res.role), { replace: true });
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  // Determine if Step 2 should be shown
  const isStep2 = Boolean(pendingFirebaseUser && !user);

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 py-8 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 transition-all">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-agro-700 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-agro-600/30">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Asra<span className="text-agro-600">Verse</span> AI
            </h1>
            <span className="text-[10px] font-bold bg-agro-100 dark:bg-agro-950 text-agro-700 dark:text-agro-300 px-2 py-0.5 rounded-full border border-agro-500/20">
              National Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isStep2
              ? 'Complete your profile setup by selecting your account role'
              : 'Sign in to access AI Crop Advisory, Mandi Marketplace & Agri Intelligence'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: AUTHENTICATION VIA GOOGLE */}
        {!isStep2 && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Step 1: Identity Authentication (प्रमाणीकरण)</span>
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Google Verified
                </span>
              </div>

              {/* Primary Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || isLoading}
                className="w-full py-4 px-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-sm transition flex items-center justify-center gap-3 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-agro-500 hover:shadow-agro-500/10 active:scale-[0.99] group disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-agro-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
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
                )}
                <span>{googleLoading ? 'Connecting to Google OAuth...' : 'Continue with Google'}</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                🔒 Secure, one-tap authentication powered by Google OAuth 2.0 & Firebase Security.
              </p>
            </div>

            {/* Manual Email Login Accordion (For System Administrators & Direct Logins) */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setShowManualLogin(!showManualLogin)}
                className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-agro-600 dark:hover:text-agro-400 transition"
              >
                {showManualLogin ? '▲ Hide Staff / Email Login' : '▼ Staff & Admin Email Sign In'}
              </button>

              {showManualLogin && (
                <form onSubmit={handleManualLogin} className="space-y-3.5 mt-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 animate-in fade-in">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={manualEmail}
                        onChange={(e) => setManualEmail(e.target.value)}
                        placeholder="admin@asraverse.in"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-agro-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={manualPassword}
                        onChange={(e) => setManualPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-agro-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={manualLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    {manualLoading ? 'Signing In...' : 'Sign In with Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE YOUR ROLE (NEW USER FLOW) */}
        {isStep2 && pendingFirebaseUser && (
          <form onSubmit={handleRoleSelectionSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
            {/* Authenticated Identity Pill */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                {pendingFirebaseUser.avatar ? (
                  <img
                    src={pendingFirebaseUser.avatar}
                    alt={pendingFirebaseUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-400 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {pendingFirebaseUser.name[0] || 'U'}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {pendingFirebaseUser.name}
                    </span>
                    <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full shrink-0">
                      Verified Google
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {pendingFirebaseUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition"
                title="Use a different Google account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Role Cards Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Step 2: Choose Your Account Role (रोल चुनें)</span>
                </span>
                <span className="text-[10px] font-bold text-agro-600 dark:text-agro-400">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_ROLES.map((item) => {
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-2 border-agro-500 bg-agro-50/50 dark:bg-agro-950/40 ring-2 ring-agro-500/20 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{item.icon}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-agro-600 dark:text-agro-400" />
                        ) : (
                          <span className="text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{item.title}</span>
                          <span className="text-slate-500 font-normal">({item.titleHi})</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Role */}
            <button
              type="submit"
              disabled={roleSubmitLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-agro-600/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
            >
              {roleSubmitLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Setup & Enter AsraVerse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Digital Agriculture Governance System</span>
          </div>
        </div>
      </div>
    </div>
  );
};
