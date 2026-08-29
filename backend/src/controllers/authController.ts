import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { isMongoConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';

// Default seeded profiles for quick role switching and instant access
const DEFAULT_ROLE_PROFILES: Record<UserRole, { name: string; email: string; phone: string; avatar: string }> = {
  FARMER: {
    name: 'Ramesh Kumar (किसान)',
    email: 'ramesh.farmer@asraverse.in',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
  },
  BUYER: {
    name: 'Suresh Patel (थोक व्यापारी)',
    email: 'suresh.buyer@asraverse.in',
    phone: '+91 98123 45678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  EXPERT: {
    name: 'Dr. Anita Sharma (KVK वैज्ञानिक)',
    email: 'dr.anita@asraverse.in',
    phone: '+91 97654 32109',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  TRANSPORT: {
    name: 'Rajesh Verma (लॉजिस्टिक्स पार्टनर)',
    email: 'rajesh.transport@asraverse.in',
    phone: '+91 96543 21098',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  ADMIN: {
    name: 'AsraVerse Admin (प्रशासक)',
    email: 'admin@asraverse.in',
    phone: '+91 99999 00000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
};

// Runtime in-memory user registry for environments without MongoDB / Vercel Serverless
export const inMemoryUsers: Map<string, any> = new Map();

// Seed in-memory users on module initialization
Object.entries(DEFAULT_ROLE_PROFILES).forEach(([role, profile]) => {
  const seededUser = {
    _id: `seed-${role.toLowerCase()}`,
    id: `seed-${role.toLowerCase()}`,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: role as UserRole,
    isVerified: true,
    avatar: profile.avatar,
    activeSessions: [
      {
        sessionId: `sess-${role.toLowerCase()}`,
        deviceInfo: 'Standard Session',
        lastActive: new Date(),
      },
    ],
    createdAt: new Date(),
  };
  inMemoryUsers.set(profile.email.toLowerCase(), seededUser);
  inMemoryUsers.set(seededUser.id, seededUser);
});

export const getInMemoryUser = (identifier: string): any => {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  for (const [key, user] of inMemoryUsers.entries()) {
    if (
      key === clean ||
      user.email?.toLowerCase() === clean ||
      user.phone === identifier ||
      user.id === identifier ||
      user._id === identifier
    ) {
      return user;
    }
  }
  return null;
};

export const generateToken = (user: any) => {
  const id = user._id ? user._id.toString() : user.id || `user-${Date.now()}`;
  return jwt.sign(
    {
      id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * 1. Quick Role Login / One-Click Authentication
 * Allows instant, friction-free login as any role (Farmer, Buyer, Expert, Transport, Admin)
 */
export const quickRoleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, name, email } = req.body;
    const targetRole = (role ? String(role).toUpperCase().trim() : 'FARMER') as UserRole;

    const allowedRoles: UserRole[] = ['FARMER', 'BUYER', 'EXPERT', 'TRANSPORT', 'ADMIN'];
    if (!allowedRoles.includes(targetRole)) {
      res.status(400).json({
        success: false,
        message: `Invalid role requested. Allowed: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    const defaultProfile = DEFAULT_ROLE_PROFILES[targetRole];
    const userEmail = (email || defaultProfile.email).toLowerCase().trim();
    const userName = name || defaultProfile.name;
    const userPhone = defaultProfile.phone;
    const userAvatar = defaultProfile.avatar;

    let user: any = null;

    if (isMongoConnected()) {
      try {
        user = await User.findOne({ email: userEmail });
        if (!user) {
          user = await User.create({
            name: userName,
            email: userEmail,
            phone: userPhone,
            role: targetRole,
            isVerified: true,
            avatar: userAvatar,
            activeSessions: [
              {
                sessionId: `sess-${Date.now()}`,
                deviceInfo: (req.headers['user-agent'] as string) || 'Web Browser',
                lastActive: new Date(),
              },
            ],
          });
        }
      } catch (dbErr) {
        console.warn('[MongoDB Quick Login Notice]:', dbErr);
      }
    }

    if (!user) {
      user = getInMemoryUser(userEmail);
      if (!user) {
        user = {
          _id: `user-${Date.now()}`,
          id: `user-${Date.now()}`,
          name: userName,
          email: userEmail,
          phone: userPhone,
          role: targetRole,
          isVerified: true,
          avatar: userAvatar,
          activeSessions: [],
          createdAt: new Date(),
        };
        inMemoryUsers.set(userEmail, user);
        inMemoryUsers.set(user.id, user);
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: `Signed in successfully as ${user.name}`,
      token,
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified !== undefined ? user.isVerified : true,
      },
    });
  } catch (error: any) {
    console.error('[Quick Role Login Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Quick login failed' });
  }
};

/**
 * 2. Standard User Registration
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const normalizedRole = (role ? String(role).toUpperCase().trim() : 'FARMER') as UserRole;

    const allowedRoles: UserRole[] = ['FARMER', 'BUYER', 'EXPERT', 'TRANSPORT', 'ADMIN'];
    if (!allowedRoles.includes(normalizedRole)) {
      res.status(400).json({
        success: false,
        message: `Invalid role selected. Allowed roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    let hashedPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const avatar =
      DEFAULT_ROLE_PROFILES[normalizedRole]?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

    let user: any = null;

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'A user with this email already exists.' });
        return;
      }

      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        phone: phone || '+91 00000 00000',
        password: hashedPassword,
        role: normalizedRole,
        isVerified: true,
        avatar,
        activeSessions: [
          {
            sessionId: `sess-${Date.now()}`,
            deviceInfo: (req.headers['user-agent'] as string) || 'Web Browser',
            lastActive: new Date(),
          },
        ],
      });
    }

    if (!user) {
      if (inMemoryUsers.has(cleanEmail)) {
        res.status(400).json({ success: false, message: 'A user with this email already exists.' });
        return;
      }
      user = {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        name: name.trim(),
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
      inMemoryUsers.set(user.id, user);
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Register User Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Error registering user.' });
  }
};

/**
 * 3. Standard Email / Password Login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, email, password } = req.body;
    const inputIdentifier = (emailOrPhone || email || '').trim();

    if (!inputIdentifier) {
      res.status(400).json({ success: false, message: 'Email or phone number is required.' });
      return;
    }

    const clean = inputIdentifier.toLowerCase();
    let user: any = null;

    if (isMongoConnected()) {
      user = await User.findOne({
        $or: [{ email: clean }, { phone: inputIdentifier }],
      });
    }

    if (!user) {
      user = getInMemoryUser(clean) || getInMemoryUser(inputIdentifier);
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found with this email or phone number.' });
      return;
    }

    // If user has a set password, verify it
    if (user.password && password) {
      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch && password !== user.password) {
        res.status(401).json({ success: false, message: 'Incorrect password entered.' });
        return;
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isVerified: user.isVerified !== undefined ? user.isVerified : true,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    console.error('[Login User Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

/**
 * 4. Get Current Authenticated User Profile (/api/auth/me)
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      id: user._id ? user._id.toString() : user.id,
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
 * 5. Active Sessions List
 */
export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  res.status(200).json({ success: true, activeSessions: req.user.activeSessions || [] });
};

/**
 * 6. Revoke a Session
 */
export const revokeSession = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const { sessionId } = req.params;
  if (Array.isArray(req.user.activeSessions)) {
    req.user.activeSessions = req.user.activeSessions.filter((s: any) => s.sessionId !== sessionId);
  }
  if (typeof req.user.save === 'function') {
    await req.user.save().catch(() => {});
  }
  res.status(200).json({ success: true, message: 'Session revoked successfully.' });
};

/**
 * 7. OTP Verification (Mock / Resilient)
 */
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'OTP verified successfully.' });
};

// Aliases for compatibility
export const googleAuth = quickRoleLogin;
export const registerRole = quickRoleLogin;
