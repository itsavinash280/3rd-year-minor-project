import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiRequest } from '../api/client';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  FirebaseUser,
} from '../config/firebase';

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
];

export interface PendingUser {
  uid: string;
  email: string;
  name: string;
  avatar: string;
  idToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  isNewUser?: boolean;
  role?: UserRole;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  pendingFirebaseUser: PendingUser | null;
  token: string | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<AuthResponse>;
  selectRole: (role: UserRole, details?: { name?: string; phone?: string; avatar?: string }) => Promise<AuthResponse>;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearPendingUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [pendingFirebaseUser, setPendingFirebaseUser] = useState<PendingUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('asraverse_token') || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Firebase Auth State Listener (Source of Truth)
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!isMounted) return;

      if (!fbUser) {
        // Unauthenticated
        setUser(null);
        setFirebaseUser(null);
        setPendingFirebaseUser(null);
        setToken(null);
        localStorage.removeItem('asraverse_token');
        localStorage.removeItem('asraverse_user');
        setIsLoading(false);
        return;
      }

      setFirebaseUser(fbUser);

      try {
        const idToken = await fbUser.getIdToken();

        // Check user record with backend
        const backendRes = await apiRequest('/auth/firebase-login', {
          method: 'POST',
          body: JSON.stringify({ idToken }),
        });

        if (!isMounted) return;

        if (backendRes.success && !backendRes.isNewUser && backendRes.user) {
          // Existing registered user
          setUser(backendRes.user);
          setToken(backendRes.token || idToken);
          setPendingFirebaseUser(null);
          localStorage.setItem('asraverse_token', backendRes.token || idToken);
        } else if (backendRes.success && backendRes.isNewUser) {
          // New authenticated user needing role selection
          setUser(null);
          setPendingFirebaseUser({
            uid: fbUser.uid,
            email: fbUser.email || `${fbUser.uid}@asraverse.in`,
            name: fbUser.displayName || 'Google User',
            avatar: fbUser.photoURL || '',
            idToken,
          });
        }
      } catch (err) {
        console.error('[Firebase Auth State Sync Error]:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Real Firebase Google Sign-In
  const loginWithGoogle = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);

      const idToken = await fbUser.getIdToken(true);

      // Verify with backend
      const backendRes = await apiRequest('/auth/firebase-login', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      });

      if (backendRes.success && !backendRes.isNewUser && backendRes.user) {
        // Existing user with saved role
        setUser(backendRes.user);
        setToken(backendRes.token || idToken);
        setPendingFirebaseUser(null);
        localStorage.setItem('asraverse_token', backendRes.token || idToken);
        setIsLoading(false);
        return { success: true, isNewUser: false, role: backendRes.user.role, user: backendRes.user };
      }

      if (backendRes.success && backendRes.isNewUser) {
        // New user -> Trigger role selection step
        const pending: PendingUser = {
          uid: fbUser.uid,
          email: fbUser.email || `${fbUser.uid}@asraverse.in`,
          name: fbUser.displayName || 'Google User',
          avatar: fbUser.photoURL || '',
          idToken,
        };
        setUser(null);
        setPendingFirebaseUser(pending);
        setIsLoading(false);
        return { success: true, isNewUser: true, message: 'Please choose your account role to complete registration.' };
      }

      setIsLoading(false);
      return { success: false, message: backendRes.message || 'Failed to authenticate with backend.' };
    } catch (error: any) {
      setIsLoading(false);
      console.error('[Google Sign-In Error]:', error);
      return {
        success: false,
        message: error.message || 'Google sign-in was cancelled or failed. Please try again.',
      };
    }
  };

  // 3. Role Selection & Backend Profile Creation (for New Users)
  const selectRole = async (
    role: UserRole,
    details?: { name?: string; phone?: string; avatar?: string }
  ): Promise<AuthResponse> => {
    if (!firebaseUser && !pendingFirebaseUser) {
      return { success: false, message: 'Google authentication required before selecting a role.' };
    }

    if (role === 'ADMIN') {
      return { success: false, message: 'Security restriction: Admin role cannot be self-assigned.' };
    }

    setIsLoading(true);
    try {
      const idToken = (await firebaseUser?.getIdToken()) || pendingFirebaseUser?.idToken;
      if (!idToken) {
        setIsLoading(false);
        return { success: false, message: 'Session expired. Please log in with Google again.' };
      }

      const res = await apiRequest('/auth/register-role', {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          role,
          name: details?.name || pendingFirebaseUser?.name || firebaseUser?.displayName,
          phone: details?.phone || '',
          avatar: details?.avatar || pendingFirebaseUser?.avatar || firebaseUser?.photoURL,
        }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token || idToken);
        setPendingFirebaseUser(null);
        localStorage.setItem('asraverse_token', res.token || idToken);
        setIsLoading(false);
        return { success: true, role: res.user.role, user: res.user };
      }

      setIsLoading(false);
      return { success: false, message: res.message || 'Failed to save role and create profile.' };
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Network error while saving role.' };
    }
  };

  // 4. Standard Email/Password Login
  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone: email, password: pass }),
      });

      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('asraverse_token', res.token);
        setIsLoading(false);
        return { success: true, role: res.user.role, user: res.user };
      }

      setIsLoading(false);
      return { success: false, message: res.message || 'Invalid email or password.' };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, message: e.message || 'Login failed.' };
    }
  };

  // 5. Standard Email/Password Registration
  const register = async (data: any): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('asraverse_token', res.token);
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

  // 6. Sign Out
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('[SignOut Warning]:', err);
    }
    setUser(null);
    setFirebaseUser(null);
    setPendingFirebaseUser(null);
    setToken(null);
    localStorage.removeItem('asraverse_token');
    localStorage.removeItem('asraverse_user');
  };

  const clearPendingUser = () => {
    setPendingFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        pendingFirebaseUser,
        token,
        isLoading,
        loginWithGoogle,
        selectRole,
        login,
        register,
        logout,
        clearPendingUser,
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

