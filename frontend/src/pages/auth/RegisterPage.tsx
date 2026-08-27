import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Phone, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'FARMER' as UserRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = await register(formData);
    if (res.success) {
      const targetRole = res.role || formData.role;
      if (targetRole === 'BUYER') navigate('/buyer');
      else if (targetRole === 'EXPERT') navigate('/expert');
      else if (targetRole === 'TRANSPORT') navigate('/transport');
      else if (targetRole === 'ADMIN') navigate('/admin');
      else navigate('/');
    } else {
      setErrorMsg(res.message || 'Registration failed. User may already exist.');
    }
  };

  const handleGoogleRegister = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const res = await loginWithGoogle(formData.role);
    setGoogleLoading(false);
    if (res.success) {
      if (formData.role === 'BUYER') navigate('/buyer');
      else if (formData.role === 'EXPERT') navigate('/expert');
      else if (formData.role === 'TRANSPORT') navigate('/transport');
      else navigate('/');
    } else {
      setErrorMsg(res.message || 'Google registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-agro-700 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-agro-600/30">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Create AsraVerse Account
          </h1>
          <p className="text-xs text-slate-500">
            Join 10,000+ farmers, buyers & scientists on AsraVerse AI
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Role Selector */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Select Account Role (खाता प्रकार)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { role: 'FARMER', label: '🌾 Farmer', desc: 'Sell crop, AI scan' },
              { role: 'BUYER', label: '🛒 Buyer', desc: 'Wholesale mandi trade' },
              { role: 'EXPERT', label: '🔬 Agri Expert', desc: 'Solve farmer queries' },
              { role: 'TRANSPORT', label: '🚚 Logistics', desc: 'Fleet delivery jobs' },
            ].map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => setFormData({ ...formData, role: item.role as UserRole })}
                className={`p-2.5 rounded-2xl text-left border transition text-xs ${
                  formData.role === item.role
                    ? 'border-agro-500 bg-agro-50/50 dark:bg-agro-950/40 text-agro-900 dark:text-agro-200 ring-2 ring-agro-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className="font-bold text-xs">{item.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Compulsory Google Registration */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Step 2: Instant Registration (गूगल से खाता बनाएं)</span>
            </span>
            <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Compulsory
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
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
              {googleLoading ? 'Setting up account...' : `Create Account with Google (as ${formData.role})`}
            </span>
          </button>
          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
            🔒 All AsraVerse users must register through Google Cloud OAuth & Firebase KYC Security.
          </p>
        </div>

        <div className="text-center text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-agro-600 dark:text-agro-400 hover:underline">
              Sign In with Google
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google OAuth 2.0 & Firebase Verified Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
