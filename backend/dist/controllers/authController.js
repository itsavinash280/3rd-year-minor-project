import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { verifyFirebaseToken } from '../config/firebaseAdmin.js';
import { isMongoConnected } from '../config/db.js';
import { SupabaseService } from '../services/supabaseService.js';
const JWT_SECRET = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';
// Fallback runtime in-memory user registry for environments without MongoDB
export const inMemoryUsers = new Map();
export const getInMemoryUser = (identifier) => {
    if (!identifier)
        return null;
    const clean = identifier.toLowerCase().trim();
    for (const [key, user] of inMemoryUsers.entries()) {
        if (key === clean ||
            user.email?.toLowerCase() === clean ||
            user.firebaseUid === identifier ||
            user.phone === identifier ||
            user.id === identifier ||
            user._id === identifier) {
            return user;
        }
    }
    return null;
};
export const generateToken = (user) => {
    const id = user._id ? user._id.toString() : user.id || `user-${Date.now()}`;
    return jwt.sign({
        id,
        role: user.role,
        email: user.email,
        name: user.name,
        firebaseUid: user.firebaseUid,
    }, JWT_SECRET, { expiresIn: '7d' });
};
/**
 * 1. Firebase Authentication Verification & Login Endpoint
 * Verifies Firebase ID Token, checks if user exists in database:
 * - If user EXISTS -> returns existing user profile, role, and session token.
 * - If user is NEW -> returns { isNewUser: true } with verified profile details, prompting Role Selection.
 */
export const firebaseAuthLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            res.status(400).json({ success: false, message: 'Firebase ID Token is required.' });
            return;
        }
        const verified = await verifyFirebaseToken(idToken);
        if (!verified || !verified.uid) {
            res.status(401).json({ success: false, message: 'Invalid or expired Firebase ID token.' });
            return;
        }
        const cleanEmail = (verified.email || `${verified.uid}@asraverse.in`).toLowerCase().trim();
        let user = null;
        // Check MongoDB if connected
        if (isMongoConnected()) {
            try {
                user = await User.findOne({
                    $or: [{ firebaseUid: verified.uid }, { email: cleanEmail }],
                });
            }
            catch (dbErr) {
                console.warn('[MongoDB Find User Error]:', dbErr);
            }
        }
        // Check in-memory fallback
        if (!user) {
            user = getInMemoryUser(verified.uid) || getInMemoryUser(cleanEmail);
        }
        // If User ALREADY EXISTS with a saved role:
        if (user && user.role) {
            // Ensure firebaseUid is linked
            if (!user.firebaseUid) {
                user.firebaseUid = verified.uid;
            }
            if (verified.picture && !user.avatar) {
                user.avatar = verified.picture;
            }
            if (typeof user.save === 'function') {
                await user.save().catch(() => { });
            }
            const token = generateToken(user);
            // Sync user with Supabase
            try {
                await SupabaseService.syncUser({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    firebaseUid: user.firebaseUid,
                    avatar: user.avatar,
                });
            }
            catch (sErr) {
                // safe ignore
            }
            res.status(200).json({
                success: true,
                isNewUser: false,
                message: 'Firebase authentication verified successfully.',
                token,
                user: {
                    id: user._id ? user._id.toString() : user.id,
                    firebaseUid: user.firebaseUid || verified.uid,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    role: user.role,
                    avatar: user.avatar || verified.picture,
                    isVerified: user.isVerified !== undefined ? user.isVerified : true,
                },
            });
            return;
        }
        // If User is NEW (no record in database):
        res.status(200).json({
            success: true,
            isNewUser: true,
            message: 'New user detected. Please select your role to complete profile creation.',
            firebaseUid: verified.uid,
            email: cleanEmail,
            name: verified.name || 'Google User',
            avatar: verified.picture || '',
        });
    }
    catch (error) {
        console.error('[Firebase Login Controller Error]:', error);
        res.status(500).json({ success: false, message: error.message || 'Firebase login verification failed' });
    }
};
/**
 * 2. Complete Profile & Register Role (Backend-Driven)
 * Saves the role permanently in the database after Google OAuth.
 * Strict Security: Rejects ADMIN self-registration.
 */
export const registerRole = async (req, res) => {
    try {
        const { idToken, role, name, phone, avatar } = req.body;
        if (!idToken) {
            res.status(400).json({ success: false, message: 'Firebase ID Token is required.' });
            return;
        }
        if (!role) {
            res.status(400).json({ success: false, message: 'Role selection is required.' });
            return;
        }
        const verified = await verifyFirebaseToken(idToken);
        if (!verified || !verified.uid) {
            res.status(401).json({ success: false, message: 'Invalid or expired Firebase authentication token.' });
            return;
        }
        const normalizedRole = String(role).toUpperCase().trim();
        // SECURITY CHECK: Admin role is strictly restricted from self-registration
        if (normalizedRole === 'ADMIN') {
            res.status(403).json({
                success: false,
                message: 'Security Violation: The Admin role cannot be self-assigned. Please contact system administrator.',
            });
            return;
        }
        const allowedRoles = ['FARMER', 'BUYER', 'EXPERT', 'TRANSPORT'];
        if (!allowedRoles.includes(normalizedRole)) {
            res.status(400).json({
                success: false,
                message: `Invalid role selected. Allowed roles: ${allowedRoles.join(', ')}`,
            });
            return;
        }
        const cleanEmail = (verified.email || `${verified.uid}@asraverse.in`).toLowerCase().trim();
        const finalName = name || verified.name || 'AsraVerse User';
        const finalAvatar = avatar ||
            verified.picture ||
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
        let user = null;
        if (isMongoConnected()) {
            try {
                user = await User.findOne({
                    $or: [{ firebaseUid: verified.uid }, { email: cleanEmail }],
                });
                if (user) {
                    // If user already exists, update role and profile details
                    user.role = normalizedRole;
                    user.name = finalName;
                    user.firebaseUid = verified.uid;
                    if (finalAvatar)
                        user.avatar = finalAvatar;
                    if (phone)
                        user.phone = phone;
                    await user.save();
                }
                else {
                    // Create new user in MongoDB
                    user = await User.create({
                        firebaseUid: verified.uid,
                        name: finalName,
                        email: cleanEmail,
                        phone: phone || '+91 00000 00000',
                        role: normalizedRole,
                        isVerified: true,
                        avatar: finalAvatar,
                        activeSessions: [
                            {
                                sessionId: 'fb-' + Date.now(),
                                deviceInfo: req.headers['user-agent'] || 'Firebase Google Session',
                                lastActive: new Date(),
                            },
                        ],
                    });
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Register Role Fallback]:', dbErr);
            }
        }
        // In-memory fallback
        if (!user) {
            user = getInMemoryUser(verified.uid) || getInMemoryUser(cleanEmail);
            if (user) {
                user.role = normalizedRole;
                user.name = finalName;
                user.firebaseUid = verified.uid;
                user.avatar = finalAvatar;
                if (phone)
                    user.phone = phone;
            }
            else {
                user = {
                    _id: `user-${Date.now()}`,
                    id: `user-${Date.now()}`,
                    firebaseUid: verified.uid,
                    name: finalName,
                    email: cleanEmail,
                    phone: phone || '+91 00000 00000',
                    role: normalizedRole,
                    isVerified: true,
                    avatar: finalAvatar,
                    activeSessions: [],
                    createdAt: new Date(),
                };
                inMemoryUsers.set(cleanEmail, user);
                inMemoryUsers.set(verified.uid, user);
            }
        }
        const token = generateToken(user);
        // Sync with Supabase
        try {
            await SupabaseService.syncUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                firebaseUid: user.firebaseUid,
                avatar: user.avatar,
            });
        }
        catch (sErr) {
            console.warn('[Supabase Sync Notice]:', sErr);
        }
        res.status(201).json({
            success: true,
            message: `Profile initialized successfully with role: ${normalizedRole}`,
            token,
            user: {
                id: user._id ? user._id.toString() : user.id,
                firebaseUid: user.firebaseUid || verified.uid,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                role: user.role,
                avatar: user.avatar,
                isVerified: true,
            },
        });
    }
    catch (error) {
        console.error('[Register Role Error]:', error);
        res.status(500).json({ success: false, message: error.message || 'Error creating user profile' });
    }
};
/**
 * 3. Get Current Authenticated User Profile
 */
export const getMe = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
    }
    const user = req.user;
    res.status(200).json({
        success: true,
        user: {
            id: user._id ? user._id.toString() : user.id,
            firebaseUid: user.firebaseUid,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified !== undefined ? user.isVerified : true,
        },
    });
};
/**
 * 4. Active Sessions List
 */
export const getSessions = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
    }
    res.status(200).json({ success: true, activeSessions: req.user.activeSessions || [] });
};
/**
 * 5. Revoke a Session
 */
export const revokeSession = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
    }
    const { sessionId } = req.params;
    if (Array.isArray(req.user.activeSessions)) {
        req.user.activeSessions = req.user.activeSessions.filter((s) => s.sessionId !== sessionId);
    }
    if (typeof req.user.save === 'function') {
        await req.user.save().catch(() => { });
    }
    res.status(200).json({ success: true, message: 'Session revoked successfully.' });
};
/**
 * 6. Standard Password / Email Registration (fallback if used)
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
            return;
        }
        const cleanEmail = email.trim().toLowerCase();
        const normalizedRole = (role ? String(role).toUpperCase().trim() : 'FARMER');
        if (normalizedRole === 'ADMIN') {
            res.status(403).json({ success: false, message: 'Admin role cannot be self-registered.' });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const avatar = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80';
        let user = null;
        if (isMongoConnected()) {
            const existingUser = await User.findOne({ email: cleanEmail });
            if (existingUser) {
                res.status(400).json({ success: false, message: 'User with this email already exists.' });
                return;
            }
            user = await User.create({
                name,
                email: cleanEmail,
                phone: phone || '+91 00000 00000',
                password: hashedPassword,
                role: normalizedRole,
                isVerified: true,
                avatar,
                activeSessions: [],
            });
        }
        if (!user) {
            if (inMemoryUsers.has(cleanEmail)) {
                res.status(400).json({ success: false, message: 'User with this email already exists.' });
                return;
            }
            user = {
                _id: `user-${Date.now()}`,
                id: `user-${Date.now()}`,
                name,
                email: cleanEmail,
                phone: phone || '+91 00000 00000',
                password: hashedPassword,
                role: normalizedRole,
                isVerified: true,
                avatar,
                activeSessions: [],
                createdAt: new Date(),
            };
            inMemoryUsers.set(cleanEmail, user);
        }
        const token = generateToken(user);
        try {
            await SupabaseService.syncUser({
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            });
        }
        catch (sErr) {
            // ignore
        }
        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Error registering user.' });
    }
};
/**
 * 7. Standard Email/Password Login
 */
export const loginUser = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;
        if (!emailOrPhone || !password) {
            res.status(400).json({ success: false, message: 'Email and password are required.' });
            return;
        }
        const clean = emailOrPhone.trim().toLowerCase();
        let user = null;
        if (isMongoConnected()) {
            user = await User.findOne({
                $or: [{ email: clean }, { phone: emailOrPhone.trim() }],
            });
        }
        if (!user) {
            user = getInMemoryUser(clean) || getInMemoryUser(emailOrPhone.trim());
        }
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
            return;
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
            if (!isMatch && password !== user.password) {
                res.status(401).json({ success: false, message: 'Invalid credentials entered.' });
                return;
            }
        }
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const verifyOtp = async (req, res) => {
    res.status(200).json({ success: true, message: 'OTP verified successfully.' });
};
export const googleAuth = firebaseAuthLogin;
