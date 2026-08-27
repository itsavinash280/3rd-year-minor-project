import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, UserCheck } from 'lucide-react';
import { useAuth, ROLE_PRESETS } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [emailOrPhone, setEmailOrPhone] = useState(ROLE_PRESETS.FARMER.email);
  const [password, setPassword] = useState(ROLE_PRESETS.FARMER.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
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

  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    const preset = ROLE_PRESETS[selectedRole];
    const res = await login(preset.email, preset.password);
    if (res.success) {
      handleRedirect(res.role);
    } else {
      setErrorMsg(res.message || 'Quick login failed.');
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

  const rolesConfig: { role: UserRole; title: string; icon: string; badge: string; color: string }[] = [
    { role: 'FARMER', title: 'Farmer (किसान)', icon: '🌾', badge: 'Crop AI & Weather', color: 'border-agro-500 bg-agro-50/50 dark:bg-agro-950/30' },
    { role: 'BUYER', title: 'Buyer (थोक खरीदार)', icon: '🛒', badge: 'Mandi Bidding', color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' },
    { role: 'EXPERT', title: 'KVK Expert (विशेषज्ञ)', icon: '🔬', badge: 'Diagnose & Consult', color: 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' },
    { role: 'TRANSPORT', title: 'Transport (माल ढुलाई)', icon: '🚚', badge: 'Fleet & Pickup', color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30' },
    { role: 'ADMIN', title: 'Admin (डायरेक्टर)', icon: '🛡️', badge: 'System Oversight', color: 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in zoom-in-95">
        
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
              National Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select your Role (किस्म/रोल चुनें) to Sign In to AsraVerse AI Platform
          </p>
        </div>

        {/* 5-Role Selector Cards Grid */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Step 1: Choose Your Role (किस रोल में लॉगिन करना है?)</span>
            </span>
            <span className="text-agro-600 dark:text-agro-400 text-[10px]">Required</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {rolesConfig.map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item.role)}
                  className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? `border-2 ${item.color} ring-2 ring-agro-500/30 shadow-md`
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{item.icon}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-agro-600 animate-ping" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {item.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selected Role Preview Badge & Quick Demo Button */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={currentPreset.avatar}
              alt={currentPreset.title}
              className="w-10 h-10 rounded-xl object-cover border border-agro-500/30 shrink-0"
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentPreset.name}
                </span>
                <span className="text-[10px] font-extrabold bg-agro-600 text-white px-2 py-0.5 rounded-full shrink-0">
                  {currentPreset.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {currentPreset.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-xs shrink-0 transition shadow flex items-center gap-1.5 active:scale-95"
            title="1-Click Demo Login with preset credentials"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>1-Click Login</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300 animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Compulsory Google Sign-In Action */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 2: Google Authentication (अनिवार्य लॉगिन)</span>
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Compulsory
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLoading}
            className="w-full py-3.5 px-5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-sm transition flex items-center justify-center gap-3 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-agro-500 hover:shadow-agro-500/10 active:scale-[0.99] group"
          >
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
            <span>
              {googleLoading ? 'Signing in with Google...' : `Continue with Google (as ${selectedRole})`}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
            🔒 All AsraVerse users must verify identity through Google OAuth & Firebase Security.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p>
            New to AsraVerse?{' '}
            <Link to="/register" className="font-bold text-agro-600 dark:text-agro-400 hover:underline">
              Create New Account with Google
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google Cloud OAuth 2.0 & Firebase Verified Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
