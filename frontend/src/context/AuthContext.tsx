import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiRequest } from '../api/client';

export interface RoleInfo {
  role: UserRole;
  title: string;
  titleHi: string;
  badge: string;
  description: string;
  icon: string;
}

export const AVAILABLE_ROLES: RoleInfo[] = [
  {
    role: 'FARMER',
    title: 'Farmer',
    titleHi: 'किसान',
    badge: 'Crop AI & Mandi',
    description: 'AI Crop Recommendation, Plant Disease Scan, Fasal Marketplace & Weather Forecasts',
    icon: '🌾',
  },
  {
    role: 'BUYER',
    title: 'Wholesale Buyer',
    titleHi: 'थोक खरीदार',
    badge: 'Direct Procurement',
    description: 'Direct Mandi Farmer Procurement, Bulk Escrow Orders & Quality Certified Produce',
    icon: '🛒',
  },
  {
    role: 'EXPERT',
    title: 'KVK Agri Expert',
    titleHi: 'कृषि विशेषज्ञ',
    badge: 'ICAR / KVK Certified',
    description: 'Provide Farmer Disease Diagnostic Consultations & Issue Scientific Prescriptions',
    icon: '🔬',
  },
  {
    role: 'TRANSPORT',
    title: 'Logistics Partner',
    titleHi: 'माल ढुलाई',
    badge: 'Fleet & Dispatch',
    description: 'Farm-to-Mandi Logistics Coordination, Truck Scheduling & Route Fleet Tracking',
    icon: '🚚',
  },
  {
    role: 'ADMIN',
    title: 'Platform Administrator',
    titleHi: 'प्रशासक',
    badge: 'Governance & Analytics',
    description: 'System Oversight, Compliance, Master Data & Platform Intelligence Monitoring',
    icon: '🛡️',
  },
];

export interface AuthResponse {
  success: boolean;
  message?: string;
  role?: UserRole;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  quickLogin: (role: UserRole, customName?: string) => Promise<AuthResponse>;
  login: (emailOrPhone: string, password?: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => void;
  // Compatibility helpers
  loginWithGoogle?: () => Promise<AuthResponse>;
  selectRole?: (role: UserRole) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem('asraverse_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('asraverse_token') || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate active session token with backend on mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const savedToken = localStorage.getItem('asraverse_token');
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await apiRequest('/auth/me');
        if (!isMounted) return;

        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('asraverse_user', JSON.stringify(res.user));
        } else {
          // Token is invalid/expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('asraverse_token');
          localStorage.removeItem('asraverse_user');
        }
      } catch (err) {
        console.warn('[Session Verification Notice]:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 1. One-Click Quick Role Login
  const quickLogin = async (role: UserRole, customName?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/quick-login', {
        method: 'POST',
        body: JSON.stringify({ role, name: customName }),
      });

      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('asraverse_token', res.token);
        localStorage.setItem('asraverse_user', JSON.stringify(res.user));
        setIsLoading(false);
        return { success: true, role: res.user.role, user: res.user };
      }

      setIsLoading(false);
      return { success: false, message: res.message || 'Login failed.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Unable to connect to authentication server.' };
    }
  };

  // 2. Standard Email / Password Sign In
  const login = async (emailOrPhone: string, password?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone, password }),
      });

      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('asraverse_token', res.token);
        localStorage.setItem('asraverse_user', JSON.stringify(res.user));
        setIsLoading(false);
        return { success: true, role: res.user.role, user: res.user };
      }

      setIsLoading(false);
      return { success: false, message: res.message || 'Invalid credentials entered.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Login failed.' };
    }
  };

  // 3. User Registration
  const register = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('asraverse_token', res.token);
        localStorage.setItem('asraverse_user', JSON.stringify(res.user));
        setIsLoading(false);
        return { success: true, role: res.user.role, user: res.user };
      }

      setIsLoading(false);
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Registration failed.' };
    }
  };

  // 4. Sign Out
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('asraverse_token');
    localStorage.removeItem('asraverse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        quickLogin,
        login,
        register,
        logout,
        loginWithGoogle: () => quickLogin('FARMER'),
        selectRole: (r: UserRole) => quickLogin(r),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
