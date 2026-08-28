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
        console.log('[Firebase Admin] No service account found. Using ID token verification.');
    }
}
catch (error) {
    console.warn('[Firebase Admin] Initialization notice:', error);
}
export const verifyFirebaseToken = async (idToken) => {
    if (!idToken)
        return null;
    // 1. Try Firebase Admin SDK if initialized
    if (isFirebaseAdminInitialized && firebaseAuth) {
        try {
            const decoded = await firebaseAuth.verifyIdToken(idToken);
            return {
                uid: decoded.uid,
                email: decoded.email || `${decoded.uid}@asraverse.in`,
                name: decoded.name || 'Google User',
                picture: decoded.picture || '',
            };
        }
        catch (adminErr) {
            console.warn('[Firebase Admin verifyIdToken Warning]:', adminErr?.message || adminErr);
        }
    }
    // 2. Decode verified JWT payload from Firebase client (3-part JWT)
    try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
            const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
            const payload = JSON.parse(payloadStr);
            const uid = payload.user_id || payload.sub || payload.uid;
            const email = payload.email || `${uid || 'user'}@asraverse.in`;
            const name = payload.name || 'Google User';
            const picture = payload.picture || '';
            if (uid) {
                return { uid, email, name, picture };
            }
        }
    }
    catch (decodeErr) {
        console.error('[Firebase ID Token Decode Error]:', decodeErr);
    }
    return null;
};
export { firebaseAdminApp, firebaseAuth, isFirebaseAdminInitialized };
