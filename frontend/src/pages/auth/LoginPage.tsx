import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, Building2, Microscope, Truck, Shield } from 'lucide-react';
import { useAuth, ROLE_PRESETS } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<'FARMER' | 'BUYER'>('FARMER');
  const [emailOrPhone, setEmailOrPhone] = useState(ROLE_PRESETS.FARMER.email);
  const [password, setPassword] = useState(ROLE_PRESETS.FARMER.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRoleSelect = (role: 'FARMER' | 'BUYER') => {
    setSelectedRole(role);
    setEmailOrPhone(ROLE_PRESETS[role].email);
    setPassword(ROLE_PRESETS[role].password);
    setErrorMsg(null);
  };

  const handleRedirect = (role?: UserRole) => {
    const targetRole = role || selectedRole;
    if (targetRole === 'BUYER') navigate('/buyer');
    else if (targetRole === 'EXPERT') navigate('/expert');
    else if (targetRole === 'TRANSPORT') navigate('/transport');
    else if (targetRole === 'ADMIN') navigate('/admin');
    else navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await login(emailOrPhone, password);
    if (res.success) {
      handleRedirect(res.role);
    } else {
      setErrorMsg(res.message || 'Invalid login credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle(selectedRole);
    setGoogleLoading(false);
    if (res.success) {
      handleRedirect(res.role);
    } else {
      setErrorMsg(res.message || 'Google Sign-In failed.');
    }
  };

  const currentPreset = ROLE_PRESETS[selectedRole];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-agro-700 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-agro-600/30">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Asra<span className="text-agro-600">Verse</span> AI
            </h1>
            <span className="text-[10px] font-bold bg-agro-100 dark:bg-agro-950 text-agro-700 dark:text-agro-300 px-2 py-0.5 rounded-full">
              Kisan & Mandi
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            National Agricultural Intelligence & Multilingual Marketplace
          </p>
        </div>

        {/* Farmer / Buyer Role Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Account Type (खाता प्रकार)</span>
          </label>

          <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => handleRoleSelect('FARMER')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'FARMER'
                  ? 'bg-white dark:bg-slate-900 text-agro-700 dark:text-agro-300 shadow-sm border border-agro-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base">🌾</span>
              <span>Farmer (किसान)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('BUYER')}
              className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                selectedRole === 'BUYER'
                  ? 'bg-white dark:bg-slate-900 text-agro-700 dark:text-agro-300 shadow-sm border border-agro-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base">🛒</span>
              <span>Buyer (थोक खरीदार)</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Google Authentication Button (Firebase Auth) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isLoading}
          className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-xs transition flex items-center justify-center gap-3 shadow-sm hover:shadow active:scale-[0.99]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span className="text-sm">
            {googleLoading ? 'Signing in with Google...' : `Continue with Google (as ${selectedRole === 'FARMER' ? 'Farmer' : 'Buyer'})`}
          </span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            or sign in with credentials
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Registered Mobile Number / Email ID
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 focus-within:border-agro-500 focus-within:ring-2 focus-within:ring-agro-500/20 transition">
              <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter mobile number or email"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password (पासवर्ड)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-agro-600 dark:text-agro-400 hover:underline flex items-center gap-1 font-medium"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 focus-within:border-agro-500 focus-within:ring-2 focus-within:ring-agro-500/20 transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedRole === 'FARMER' ? 'Farmer' : 'Buyer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Separate Portals Section (Admins, Experts, Transport) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
            Dedicated Staff & Partner Portals
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <Link
              to="/admin/login"
              className="p-2.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-800/40 text-rose-800 dark:text-rose-300 hover:scale-105 transition flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="font-bold text-[11px]">Admin Login</span>
            </Link>

            <Link
              to="/expert/login"
              className="p-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 text-indigo-800 dark:text-indigo-300 hover:scale-105 transition flex flex-col items-center gap-1"
            >
              <Microscope className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-[11px]">KVK Expert</span>
            </Link>

            <Link
              to="/transport/login"
              className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:scale-105 transition flex flex-col items-center gap-1"
            >
              <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-[11px]">Transport</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-1">
          <p>
            New to AsraVerse?{' '}
            <Link to="/register" className="font-bold text-agro-600 dark:text-agro-400 hover:underline">
              Create Farmer / Buyer Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firebase Cloud Auth & Masked Aadhaar Data Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
