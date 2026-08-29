import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Sprout, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const getRoleHomePath = (role: UserRole): string => {
  switch (role) {
    case 'BUYER':
      return '/buyer';
    case 'EXPERT':
      return '/expert';
    case 'TRANSPORT':
      return '/transport';
    case 'ADMIN':
      return '/admin';
    case 'FARMER':
    default:
      return '/';
  }
};

export const LoadingSplashScreen: React.FC<{ message?: string }> = ({
  message = 'Verifying secure session with National Agri Intelligence Portal...',
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white select-none">
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-agro-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-pulse">
          <Sprout className="w-12 h-12 text-white animate-bounce" />
        </div>
        <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400/40 animate-ping pointer-events-none" />
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-black tracking-tight text-white">
            Asra<span className="text-agro-400">Verse</span> AI
          </h2>
          <span className="text-[10px] font-extrabold bg-agro-900 text-agro-300 px-2 py-0.5 rounded-full border border-agro-700">
            Govt. Aligned
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {message}
        </p>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto mt-4">
          <div className="w-full h-full bg-gradient-to-r from-agro-500 via-emerald-400 to-agro-600 rounded-full animate-indeterminate" />
        </div>

        <div className="pt-6 flex items-center justify-center gap-1.5 text-[11px] text-emerald-400/80">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Encrypted JWT & Zero-Trust Session Verification</span>
        </div>
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSplashScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const roleHome = getRoleHomePath(user.role);

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Access Restricted (अनधिकृत प्रवेश)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This module is strictly designated for{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {allowedRoles.join(', ')}
              </span>{' '}
              accounts. Your current account role is{' '}
              <span className="font-extrabold text-rose-600 dark:text-rose-400">
                {user.role}
              </span>.
            </p>
          </div>

          <Link
            to={roleHome}
            className="w-full py-3.5 px-6 rounded-2xl bg-agro-600 hover:bg-agro-700 text-white font-bold text-sm shadow-lg shadow-agro-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>Return to My {user.role} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
