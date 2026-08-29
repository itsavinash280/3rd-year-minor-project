import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAuth, AVAILABLE_ROLES } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getRoleHomePath } from '../../components/common/ProtectedRoute';

export interface LoginPageProps {
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole }) => {
  const { user, quickLogin, login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'quick' | 'email'>('quick');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'FARMER');

  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If user is already authenticated, redirect to destination or role dashboard
  useEffect(() => {
    if (user && user.role) {
      const from = (location.state as any)?.from?.pathname;
      const targetPath = from || getRoleHomePath(user.role);
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, location]);

  // Set default initialRole if supplied via props
  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // 1. One-Click Quick Role Sign-In
  const handleQuickRoleSignIn = async (role: UserRole) => {
    setErrorMsg(null);
    setActionLoading(true);

    const res = await quickLogin(role);
    setActionLoading(false);

    if (res.success && res.role) {
      navigate(getRoleHomePath(res.role), { replace: true });
    } else {
      setErrorMsg(res.message || 'Quick login failed. Please try again.');
    }
  };

  // 2. Email & Password Form Submit (Login or Register)
  const handleEmailFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setActionLoading(true);

    if (isRegisterMode) {
      const res = await register({
        name,
        email,
        phone,
        password,
        role: selectedRole,
      });
      setActionLoading(false);

      if (res.success && res.role) {
        navigate(getRoleHomePath(res.role), { replace: true });
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check your details.');
      }
    } else {
      const res = await login(email, password);
      setActionLoading(false);

      if (res.success && res.role) {
        navigate(getRoleHomePath(res.role), { replace: true });
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 py-8 select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 transition-all">
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
            AI-Powered Agricultural Platform for Indian Agriculture, Mandi Trade & Intelligence
          </p>
        </div>

        {/* Auth Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quick');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'quick'
                ? 'bg-white dark:bg-slate-900 text-agro-600 dark:text-agro-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Instant Role Access (1-Click)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'email'
                ? 'bg-white dark:bg-slate-900 text-agro-600 dark:text-agro-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: ONE-CLICK QUICK ROLE ACCESS */}
        {activeTab === 'quick' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Select Your Role to Enter Immediately (रोल चुनें)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_ROLES.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  disabled={actionLoading || isLoading}
                  onClick={() => handleQuickRoleSignIn(item.role)}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-agro-500 dark:hover:border-agro-500 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-left transition group shadow-sm hover:shadow-md hover:shadow-agro-500/10 flex flex-col justify-between active:scale-[0.99] disabled:opacity-60"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full group-hover:bg-agro-100 dark:group-hover:bg-agro-950 group-hover:text-agro-700 dark:group-hover:text-agro-300 transition">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <span className="text-slate-500 font-normal">({item.titleHi})</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-agro-600 dark:text-agro-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Sign In as {item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL & PASSWORD (LOGIN / REGISTER) */}
        {activeTab === 'email' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Mode Switcher */}
            <div className="flex justify-center gap-4 text-xs font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`pb-2 border-b-2 transition ${
                  !isRegisterMode
                    ? 'border-agro-600 text-agro-600 dark:text-agro-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Sign In to Account
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`pb-2 border-b-2 transition ${
                  isRegisterMode
                    ? 'border-agro-600 text-agro-600 dark:text-agro-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Create New Account
              </button>
            </div>

            <form onSubmit={handleEmailFormSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-agro-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@asraverse.in or 9876543210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-agro-500 focus:outline-none"
                  />
                </div>
              </div>

              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-agro-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={isRegisterMode}
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

              {isRegisterMode && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_ROLES.filter((r) => r.role !== 'ADMIN').map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setSelectedRole(r.role)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                          selectedRole === r.role
                            ? 'border-agro-600 bg-agro-50/50 dark:bg-agro-950/40 text-agro-700 dark:text-agro-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span>{r.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={actionLoading || isLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-agro-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Register Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Agriculture Governance & AI Advisory System</span>
          </div>
        </div>
      </div>
    </div>
  );
};
