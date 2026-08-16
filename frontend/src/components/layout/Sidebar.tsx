import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  ScanLine,
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  CloudSun,
  Award,
  User,
  ShieldAlert,
  Truck,
  MessageSquareHeart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'FARMER';

  const navItems = [
    // Farmer Items
    {
      label: 'Farmer Dashboard',
      to: '/',
      icon: LayoutDashboard,
      roles: ['FARMER'],
    },
    {
      label: 'AI Crop Recommend',
      to: '/crop-recommendation',
      icon: Sprout,
      roles: ['FARMER', 'EXPERT', 'ADMIN'],
      badge: 'AI',
    },
    {
      label: 'Disease Detection',
      to: '/disease-detection',
      icon: ScanLine,
      roles: ['FARMER', 'EXPERT', 'ADMIN'],
      badge: 'CNN',
    },
    {
      label: 'Mandi Price Forecast',
      to: '/price-prediction',
      icon: TrendingUp,
      roles: ['FARMER', 'BUYER', 'ADMIN'],
      badge: 'Forecast',
    },
    {
      label: 'Crop Marketplace',
      to: '/marketplace',
      icon: ShoppingBag,
      roles: ['FARMER', 'BUYER', 'ADMIN'],
    },
    {
      label: 'My Orders & Invoices',
      to: '/orders',
      icon: Package,
      roles: ['FARMER', 'BUYER', 'TRANSPORT', 'ADMIN'],
    },
    {
      label: 'Agricultural Experts',
      to: '/expert-consultation',
      icon: Users,
      roles: ['FARMER', 'EXPERT', 'ADMIN'],
    },
    {
      label: 'Weather & Advisory',
      to: '/weather',
      icon: CloudSun,
      roles: ['FARMER', 'BUYER', 'EXPERT', 'TRANSPORT', 'ADMIN'],
    },
    {
      label: 'Govt Schemes (PM-Kisan)',
      to: '/schemes',
      icon: Award,
      roles: ['FARMER', 'BUYER', 'EXPERT', 'ADMIN'],
    },

    // Buyer Dedicated Dashboard
    {
      label: 'Buyer Dashboard',
      to: '/buyer',
      icon: LayoutDashboard,
      roles: ['BUYER'],
    },

    // Expert Dedicated Dashboard
    {
      label: 'Expert Dashboard',
      to: '/expert',
      icon: MessageSquareHeart,
      roles: ['EXPERT'],
    },

    // Transport Dashboard
    {
      label: 'Transport Deliveries',
      to: '/transport',
      icon: Truck,
      roles: ['TRANSPORT'],
    },

    // Admin Dashboard
    {
      label: 'Admin Control Center',
      to: '/admin',
      icon: ShieldAlert,
      roles: ['ADMIN'],
    },

    // Farm Profile
    {
      label: 'Farm Profile',
      to: '/profile',
      icon: User,
      roles: ['FARMER'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* User Role Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agro-100 dark:bg-agro-900/50 flex items-center justify-center text-agro-700 dark:text-agro-400 font-bold text-base">
                {user?.name ? user.name[0] : 'K'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {user?.name || 'Kisan User'}
                </p>
                <span className="inline-block text-[10px] font-bold text-agro-600 dark:text-agro-400">
                  ● {role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </p>
            {filteredNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-agro-600 text-white shadow-sm shadow-agro-600/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Help & Emergency Call Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-agro-900 to-emerald-950 text-white shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Kisan Helpline 24x7
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Need free agricultural expert advice or claim status?
            </p>
            <a
              href="tel:18001801551"
              className="block text-center py-1.5 px-3 rounded-xl bg-agro-600 hover:bg-agro-500 text-white text-xs font-bold transition"
            >
              📞 1800-180-1551
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
