import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
dotenv.config();
let firebaseAdminApp = null;
let firebaseAuth = null;
let isFirebaseAdminInitialized = false;
try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        firebaseAdminApp = initializeApp({
            credential: cert(serviceAccount),
        });
        firebaseAuth = getAuth(firebaseAdminApp);
        isFirebaseAdminInitialized = true;
        console.log('[Firebase Admin] Initialized successfully with Service Account file.');
    }
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        firebaseAdminApp = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        firebaseAuth = getAuth(firebaseAdminApp);
        isFirebaseAdminInitialized = true;
        console.log('[Firebase Admin] Initialized successfully with Environment Credentials.');
    }
    else {
        console.log('[Firebase Admin] No service account found. Operating in local JWT / fallback mode.');
    }
}
catch (error) {
    console.warn('[Firebase Admin] Notice (using fallback handler):', error);
}
export { firebaseAdminApp, firebaseAuth, isFirebaseAdminInitialized };
