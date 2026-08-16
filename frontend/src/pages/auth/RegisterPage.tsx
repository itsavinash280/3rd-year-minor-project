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

        {/* Google Quick Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading || isLoading}
          className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-xs transition flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
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
          <span>{googleLoading ? 'Connecting...' : `Sign Up with Google as ${formData.role}`}</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            or fill details
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name (पूरा नाम)
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2">
              <User className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                required
                placeholder="e.g. Ramashankar Yadav"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mobile Number (मोबाइल नंबर)
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2">
              <Phone className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address (ईमेल)
            </label>
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2">
              <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="email"
                required
                placeholder="name@asraverse.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
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
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 px-3.5 py-2">
              <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create secure password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-agro-600 to-emerald-600 hover:from-agro-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-agro-600/30 transition flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'Creating Account...' : `Register as ${formData.role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 space-y-2">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-agro-600 dark:text-agro-400 hover:underline">
              Sign in with Role ID
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aadhaar privacy & encrypted cloud credentials</span>
          </div>
        </div>
      </div>
    </div>
  );
};
