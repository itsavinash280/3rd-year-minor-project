import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ScanLine,
  TrendingUp,
  ShoppingBag,
  CloudSun,
  Mic,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { openVoiceAssistant } = useVoiceAssistant();

  const quickActions = [
    {
      title: 'AI Crop Recommend',
      subtitle: 'Based on soil & climate',
      icon: Sprout,
      to: '/crop-recommendation',
      color: 'bg-emerald-500 text-white',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Scan Leaf Disease',
      subtitle: 'CNN image diagnosis',
      icon: ScanLine,
      to: '/disease-detection',
      color: 'bg-teal-600 text-white',
      bgLight: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
    },
    {
      title: 'Mandi Price Forecast',
      subtitle: '6-month price trends',
      icon: TrendingUp,
      to: '/price-prediction',
      color: 'bg-amber-500 text-slate-950 font-bold',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    },
    {
      title: 'Sell Crops Online',
      subtitle: 'Direct to 5,000+ buyers',
      icon: ShoppingBag,
      to: '/marketplace',
      color: 'bg-indigo-600 text-white',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    },
  ];

  const liveMandiPrices = [
    { crop: 'Sharbati Wheat (Gehu)', mandi: 'Lucknow APMC', price: '₹2,275 / Qtl', trend: '+3.2%', isUp: true },
    { crop: 'Yellow Mustard (Sarson)', mandi: 'Kanpur Grain Mandi', price: '₹5,650 / Qtl', trend: '+4.8%', isUp: true },
    { crop: 'Basmati Paddy (Dhan)', mandi: 'Varanasi Mandi', price: '₹3,400 / Qtl', trend: '+1.5%', isUp: true },
    { crop: 'Pusa Ruby Tomato', mandi: 'Azadpur Delhi', price: '₹1,850 / Qtl', trend: '-2.1%', isUp: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-agro-900 via-agro-800 to-emerald-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Farming AI Co-Pilot Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ram Ram, {user?.name || 'Kisan Bhai'}! 🌾
            </h1>
            <p className="text-sm text-agro-100 leading-relaxed">
              Your farm in <span className="font-semibold text-white">Malihabad, Lucknow</span> is ready for Rabi crop preparation. Soil moisture and upcoming weather are optimal.
            </p>
          </div>

          {/* Voice Assistant Floating Shortcut */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openVoiceAssistant}
              className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg transition active:scale-95"
            >
              <Mic className="w-5 h-5 text-slate-950 animate-bounce" />
              <span>Bol kar poochhein (AI Voice)</span>
            </button>
            <Link
              to="/profile"
              className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition"
            >
              <span>View Farm Profile</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards (Large Visual Targets for Farmers) */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Key Agriculture Services (मुख्य सेवाएं)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.to}
                className={`p-5 rounded-3xl border transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${action.bgLight}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{action.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{action.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Weather & Advisory + Live Mandi Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather & Agromet Advisory */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Today's Weather</h3>
            </div>
            <Link to="/weather" className="text-xs text-agro-600 dark:text-agro-400 font-bold hover:underline">
              7-Day Forecast →
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <div>
              <span className="text-3xl font-extrabold">31°C</span>
              <p className="text-xs text-blue-100 font-medium">Partly Cloudy • Lucknow</p>
            </div>
            <div className="text-right text-xs text-blue-100 space-y-0.5">
              <p>Humidity: <span className="font-bold text-white">62%</span></p>
              <p>Rain Chance: <span className="font-bold text-white">10%</span></p>
              <p>Wind: <span className="font-bold text-white">14 km/h</span></p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Agromet Advisory for Rabi Sowing</span>
            </div>
            <p className="leading-relaxed">
              Favorable weather for field ploughing and bed preparation. Postpone pesticide sprays on Aug 17 due to predicted showers.
            </p>
          </div>
        </div>

        {/* Live Mandi Prices */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Live Mandi Prices (मंडी भाव)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time daily modal rates from UP & Delhi Mandis</p>
            </div>
            <Link to="/price-prediction" className="text-xs text-agro-600 dark:text-agro-400 font-bold hover:underline">
              AI Price Forecast →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {liveMandiPrices.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.crop}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.mandi}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">{item.price}</p>
                  <span
                    className={`text-xs font-bold ${
                      item.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Govt Scheme Alert Bar */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  PM-KISAN 17th Installment Status Active
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Check your e-KYC status and Aadhaar bank link to receive ₹2,000 benefit.
                </p>
              </div>
            </div>
            <Link
              to="/schemes"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
