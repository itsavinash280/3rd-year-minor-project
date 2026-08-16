import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Award, FileText } from 'lucide-react';
import { useAuth, ROLE_PRESETS } from '../../context/AuthContext';

export const ExpertLoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState(ROLE_PRESETS.EXPERT.email);
  const [password, setPassword] = useState(ROLE_PRESETS.EXPERT.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await login(emailOrPhone, password);
    if (res.success) {
      navigate('/expert');
    } else {
      setErrorMsg(res.message || 'Expert login failed. Invalid credentials.');
    }
  };

  const handleAutofill = () => {
    setEmailOrPhone(ROLE_PRESETS.EXPERT.email);
    setPassword(ROLE_PRESETS.EXPERT.password);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
            <Microscope className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              ICAR & KVK Expert Portal
            </h1>
            <span className="text-[10px] font-bold bg-indigo-950 border border-indigo-700/60 text-indigo-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Scientist
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Agricultural Scientists & Plant Pathology Diagnostic Workspace
          </p>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-indigo-200 text-xs flex items-center gap-2.5">
          <Award className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Access disease escalation tickets, AI model validation, and farmer video consultations.</span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800 text-xs font-semibold text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Official Scientist / KVK Email
            </label>
            <div className="flex items-center bg-slate-800/80 rounded-2xl border border-slate-700 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
              <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="expert@asraverse.in"
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300">
                Scientist Portal Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="flex items-center bg-slate-800/80 rounded-2xl border border-slate-700 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Demo Autofill Button */}
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Autofill Expert Credentials (expert@asraverse.in)</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-indigo-900/30 transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Expert Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 space-y-3 pt-2">
          <div className="flex justify-center gap-4 text-slate-400 text-xs">
            <Link to="/login" className="hover:text-emerald-400 hover:underline">
              ← Farmer / Buyer Portal
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-rose-400 hover:underline">
              Admin Portal
            </Link>
            <span>•</span>
            <Link to="/transport/login" className="hover:text-amber-400 hover:underline">
              Logistics Portal
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ICAR Certified Agricultural Scientist Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
