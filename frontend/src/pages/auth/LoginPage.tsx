import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth, AVAILABLE_ROLES } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getRoleHomePath } from '../../components/common/ProtectedRoute';

export interface LoginPageProps {
  initialRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRole }) => {
  const { user, login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Handle Form Submit (Sign In or Register)
  const handleSubmit = async (e: React.FormEvent) => {
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 transition-all">
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
            {isRegisterMode
              ? 'Create your digital agriculture account to access AI advisories & Mandi trade'
              : 'Sign in to access your AI Crop Advisory, Mandi Marketplace & Agri Intelligence'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              !isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-agro-600 dark:text-agro-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isRegisterMode
                ? 'bg-white dark:bg-slate-900 text-agro-600 dark:text-agro-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                Full Name (पूरा नाम)
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
              Email Address or Mobile Number (ईमेल / मोबाइल)
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
                Phone Number (मोबाइल नंबर)
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Password (पासवर्ड)
              </label>
            </div>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Account Role (खाता प्रकार)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_ROLES.filter((r) => r.role !== 'ADMIN').map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSelectedRole(r.role)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition ${
                      selectedRole === r.role
                        ? 'border-agro-600 bg-agro-50/50 dark:bg-agro-950/40 text-agro-700 dark:text-agro-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg">{r.icon}</span>
                    <div className="overflow-hidden">
                      <span className="block truncate">{r.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal block truncate">({r.titleHi})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={actionLoading || isLoading}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-agro-600/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 mt-2"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegisterMode ? 'Complete Registration & Enter' : 'Sign In to AsraVerse'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Agriculture Governance & Encrypted Session Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
