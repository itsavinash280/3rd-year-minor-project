import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';

// Firebase configuration for AsraVerse AI
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB8xDbAc6Xk0YqM2vqfN9e8uEW5ykduP3Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'asraverse-ai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'asraverse-ai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'asraverse-ai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '953571605491',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:953571605491:web:eedee8116678e7a1567086',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EMTL84LGNC',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key'
);

let app: FirebaseApp;
let auth: Auth;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (error) {
  console.warn('[Firebase Client Initialized with Fallback]:', error);
  app = initializeApp(firebaseConfig, 'asraverse-app');
  auth = getAuth(app);
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  app,
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
export type { FirebaseUser };

