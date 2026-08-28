import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Mic,
  ShoppingCart,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { UserRole } from '../../types';

export const Navbar: React.FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { openVoiceAssistant, isSpeaking } = useVoiceAssistant();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Top Advisory Bar */}
      <div className="bg-agro-900 text-white text-xs py-1.5 px-4 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <span className="bg-agro-600 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            Government of India Aligned
          </span>
          <span className="text-agro-200">
            Kisan Call Centre Toll-Free: 1800-180-1551 (6:00 AM - 10:00 PM)
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-agro-600 flex items-center justify-center text-white shadow-md shadow-agro-600/30 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Asra<span className="text-agro-600">Verse</span>
                </span>
                <span className="text-[11px] font-bold bg-agro-100 dark:bg-agro-950 text-agro-700 dark:text-agro-300 px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                National Agriculture Intelligence Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Voice Assistant Highlight Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={openVoiceAssistant}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-agro-600 to-emerald-600 text-white text-sm font-semibold shadow-md shadow-agro-600/25 hover:from-agro-700 hover:to-emerald-700 active:scale-95 transition"
          >
            <div className={`w-3 h-3 rounded-full bg-white ${isSpeaking ? 'animate-ping' : ''}`} />
            <Mic className="w-4 h-4 text-white" />
            <span>AI Voice Assistant</span>
            <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-medium">
              हिंदी / Eng
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart for Buyers / Farmers */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-agro-600 dark:text-agro-400 font-bold uppercase">
                    {user.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-agro-100 dark:bg-agro-900 text-agro-700 dark:text-agro-300">
                      {user.role} Account
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Farm Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    My Orders & Deliveries
                  </Link>

                  {/* Dedicated Staff Portals */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Staff & Partner Portals
                    </p>
                    <Link
                      to="/admin/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <span>Admin Governance</span>
                      <span className="text-[10px] font-semibold bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded">Portal</span>
                    </Link>
                    <Link
                      to="/expert/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    >
                      <span>KVK Agri Expert</span>
                      <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded">Portal</span>
                    </Link>
                    <Link
                      to="/transport/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      <span>Transport & Fleet</span>
                      <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">Portal</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-agro-600 text-white text-sm font-semibold hover:bg-agro-700 transition shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
