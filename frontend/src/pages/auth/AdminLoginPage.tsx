import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Server, Terminal } from 'lucide-react';
import { useAuth, ROLE_PRESETS } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState(ROLE_PRESETS.ADMIN.email);
  const [password, setPassword] = useState(ROLE_PRESETS.ADMIN.password);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await login(emailOrPhone, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMsg(res.message || 'Admin authorization failed. Invalid security key.');
    }
  };

  const handleAutofill = () => {
    setEmailOrPhone(ROLE_PRESETS.ADMIN.email);
    setPassword(ROLE_PRESETS.ADMIN.password);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Subtle Admin Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Admin & Governance Portal
            </h1>
            <span className="text-[10px] font-bold bg-rose-950/80 border border-rose-700/60 text-rose-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Restricted
            </span>
          </div>
          <p className="text-xs text-slate-400">
            AsraVerse National Agricultural Platform Director & System Oversight
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-300/90 text-xs flex items-center gap-2.5">
          <Server className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Restricted to authorized system administrators. All sessions are cryptographically logged.</span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800 text-xs font-semibold text-rose-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Super Admin Email ID
            </label>
            <div className="flex items-center bg-slate-800/80 rounded-2xl border border-slate-700 px-3.5 py-2.5 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition">
              <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="admin@asraverse.in"
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-300">
                Master Security Key / Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="flex items-center bg-slate-800/80 rounded-2xl border border-slate-700 px-3.5 py-2.5 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
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
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Autofill Admin Credentials (admin@asraverse.in)</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-rose-900/30 transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'Authenticating Admin...' : 'Authenticate Master Session'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 space-y-3 pt-2">
          <div className="flex justify-center gap-4 text-slate-400 text-xs">
            <Link to="/login" className="hover:text-emerald-400 hover:underline">
              ← Farmer / Buyer Portal
            </Link>
            <span>•</span>
            <Link to="/expert/login" className="hover:text-emerald-400 hover:underline">
              KVK Expert Portal
            </Link>
            <span>•</span>
            <Link to="/transport/login" className="hover:text-emerald-400 hover:underline">
              Logistics Portal
            </Link>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit Hardware Token & Role-Enforced Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};
