import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiRequest } from '../api/client';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  isFirebaseConfigured,
} from '../config/firebase';

export interface RolePreset {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  avatar: string;
  description: string;
}

export const ROLE_PRESETS: Record<UserRole, RolePreset> = {
  FARMER: {
    role: 'FARMER',
    title: 'Farmer (किसान)',
    name: 'Ramashankar Yadav',
    email: 'farmer1@asraverse.in',
    password: 'Farmer@2026',
    badge: 'Kisan Verified',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    description: 'Crop Recommendation, Disease Scan, Fasal Marketplace & Weather',
  },
  BUYER: {
    role: 'BUYER',
    title: 'Wholesale Buyer (थोक खरीदार)',
    name: 'Organic Harvest Wholesalers',
    email: 'buyer@asraverse.in',
    password: 'Buyer@2026',
    badge: 'GST Registered',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    description: 'Bulk Produce Procurement, Mandi Bidding & Escrow Orders',
  },
  EXPERT: {
    role: 'EXPERT',
    title: 'Agri Expert (कृषि विशेषज्ञ)',
    name: 'Dr. Anita Verma (KVK Agronomist)',
    email: 'expert@asraverse.in',
    password: 'Expert@2026',
    badge: 'ICAR Certified',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    description: 'Farmer Disease Diagnosis Consultations & Scientific Prescriptions',
  },
  TRANSPORT: {
    role: 'TRANSPORT',
    title: 'Logistics Partner (माल ढुलाई)',
    name: 'Kisaan Express Logistics',
    email: 'transport@asraverse.in',
    password: 'Transport@2026',
    badge: 'Fleet Verified',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    description: 'Truck Dispatch, Mandi Pickup Coordination & Route Tracking',
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Platform Admin (सिस्टम डायरेक्टर)',
    name: 'Dr. Ramesh Sharma (Platform Director)',
    email: 'admin@asraverse.in',
    password: 'Admin@2026',
    badge: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    description: 'System Oversight, User Moderation, AI Model Metrics & Analytics',
  },
};

interface AuthResponse {
  success: boolean;
  message?: string;
  role?: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<AuthResponse>;
  loginWithGoogle: (role?: UserRole) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('asraverse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('asraverse_token') || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token && token !== 'demo-jwt-token') {
      apiRequest('/auth/me').then((res) => {
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('asraverse_user', JSON.stringify(res.user));
        }
      });
    }
  }, [token]);

  const saveAuthSession = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('asraverse_user', JSON.stringify(newUser));
    localStorage.setItem('asraverse_token', newToken);
  };

  // 1. Email / Password Login (Firebase + Backend / Smart Preset Fallback)
  const login = async (emailOrPhone: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    const cleanEmail = emailOrPhone.trim().toLowerCase();

    // Check if matching any of the 5 Role Presets
    const matchedPreset = Object.values(ROLE_PRESETS).find(
      (p) =>
        p.email.toLowerCase() === cleanEmail ||
        (cleanEmail.includes('farmer') && p.role === 'FARMER') ||
        (cleanEmail.includes('buyer') && p.role === 'BUYER') ||
        (cleanEmail.includes('expert') && p.role === 'EXPERT') ||
        (cleanEmail.includes('transport') && p.role === 'TRANSPORT') ||
        (cleanEmail.includes('admin') && p.role === 'ADMIN')
    );

    // If Firebase configured, attempt Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const firebaseIdToken = await userCredential.user.getIdToken();

        // Send to backend verification
        const backendRes = await apiRequest('/auth/firebase-login', {
          method: 'POST',
          body: JSON.stringify({ idToken: firebaseIdToken }),
        });

        if (backendRes.success && backendRes.user) {
          saveAuthSession(backendRes.user, backendRes.token);
          setIsLoading(false);
          return { success: true, role: backendRes.user.role };
        }
      } catch (fbErr: any) {
        console.warn('[Firebase Login Attempt]:', fbErr.message);
        // If live Firebase fails, check backend or fallback
      }
    }

    // Try standard Backend REST API
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone: cleanEmail, password: pass }),
      });

      if (res.success && res.user) {
        saveAuthSession(res.user, res.token);
        setIsLoading(false);
        return { success: true, role: res.user.role };
      }
    } catch (apiErr) {
      console.warn('[Backend Login Attempt]:', apiErr);
    }

    // Fallback: Smart Preset Authentication for seamless offline/demo testing
    if (matchedPreset) {
      const fallbackUser: User = {
        id: `user-${matchedPreset.role.toLowerCase()}-1`,
        name: matchedPreset.name,
        email: matchedPreset.email,
        phone: '+91 98765 00001',
        role: matchedPreset.role,
        isVerified: true,
        avatar: matchedPreset.avatar,
      };
      saveAuthSession(fallbackUser, `demo-token-${matchedPreset.role.toLowerCase()}`);
      setIsLoading(false);
      return { success: true, role: matchedPreset.role };
    }

    setIsLoading(false);
    return {
      success: false,
      message: 'Invalid credentials. Please select one of the 5 Role Presets or enter correct details.',
    };
  };

  // 2. Google Sign-In (Firebase Popup + Backend Session)
  const loginWithGoogle = async (preferredRole: UserRole = 'FARMER'): Promise<AuthResponse> => {
    setIsLoading(true);

    if (isFirebaseConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const idToken = await fbUser.getIdToken();

        // Sync with backend
        const backendRes = await apiRequest('/auth/firebase-login', {
          method: 'POST',
          body: JSON.stringify({ idToken, defaultRole: preferredRole }),
        });

        if (backendRes.success && backendRes.user) {
          saveAuthSession(backendRes.user, backendRes.token);
          setIsLoading(false);
          return { success: true, role: backendRes.user.role };
        }

        // Direct fallback from Firebase user
        const gUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google User',
          email: fbUser.email || `${fbUser.uid}@asraverse.in`,
          phone: fbUser.phoneNumber || '+91 98765 00000',
          role: preferredRole,
          isVerified: true,
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        };
        saveAuthSession(gUser, idToken);
        setIsLoading(false);
        return { success: true, role: preferredRole };
      } catch (error: any) {
        console.error('[Google Sign-In Error]:', error);
        setIsLoading(false);
        return {
          success: false,
          message: error.message || 'Google Sign-In was cancelled or failed.',
        };
      }
    } else {
      // Demo Google Mock Login
      const gUser: User = {
        id: 'google-demo-user-1',
        name: 'Google Verified Kisan',
        email: 'google.kisan@asraverse.in',
        phone: '+91 98765 12345',
        role: preferredRole,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      };
      saveAuthSession(gUser, 'demo-google-jwt-token');
      setIsLoading(false);
      return { success: true, role: preferredRole };
    }
  };

  // 3. Register New Account (Firebase + Backend)
  const register = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);

    if (isFirebaseConfigured && auth && data.email && data.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const idToken = await userCredential.user.getIdToken();

        const res = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ ...data, firebaseUid: userCredential.user.uid, idToken }),
        });

        if (res.success && res.user) {
          saveAuthSession(res.user, res.token || idToken);
          setIsLoading(false);
          return { success: true, role: res.user.role };
        }
      } catch (fbErr: any) {
        console.warn('[Firebase Register]:', fbErr.message);
      }
    }

    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success && res.user) {
        saveAuthSession(res.user, res.token);
        setIsLoading(false);
        return { success: true, role: res.user.role };
      }
    } catch (e) {
      console.warn('[Backend Register]:', e);
    }

    // Local Fallback Register
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role || 'FARMER',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    };
    saveAuthSession(newUser, `token-${Date.now()}`);
    setIsLoading(false);
    return { success: true, role: newUser.role };
  };

  // 4. Logout
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('asraverse_user');
    localStorage.removeItem('asraverse_token');
  };

  // 5. Quick Role Switcher
  const switchDemoRole = (role: UserRole) => {
    const preset = ROLE_PRESETS[role];
    const newUser: User = {
      id: `demo-${role.toLowerCase()}-1`,
      name: preset.name,
      email: preset.email,
      phone: '+91 98765 00100',
      role: preset.role,
      isVerified: true,
      avatar: preset.avatar,
    };
    setUser(newUser);
    localStorage.setItem('asraverse_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        switchDemoRole,
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
