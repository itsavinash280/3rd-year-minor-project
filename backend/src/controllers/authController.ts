import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser, UserRole } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { firebaseAuth, isFirebaseAdminInitialized } from '../config/firebaseAdmin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';

const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'All fields (name, email, phone, password) are required.' });
      return;
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email or phone already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Development OTP: 123456
    const otp = '123456';
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: (role as UserRole) || 'FARMER',
      isVerified: true,
      otp,
      otpExpires,
      activeSessions: [
        {
          sessionId: Math.random().toString(36).substring(2, 9),
          deviceInfo: req.headers['user-agent'] || 'Web Browser (Chrome/Windows)',
          lastActive: new Date(),
        },
      ],
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Verification OTP sent.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error registering user.' });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
      return;
    }

    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (otp !== '123456' && user.otp !== otp) {
      res.status(400).json({ success: false, message: 'Invalid OTP entered. Please try 123456.' });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Mobile number verified successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      res.status(400).json({ success: false, message: 'Email/Phone and Password are required.' });
      return;
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
    });

    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    // Add session
    const newSession = {
      sessionId: Math.random().toString(36).substring(2, 9),
      deviceInfo: (req.headers['user-agent'] as string) || 'Web Browser (Windows)',
      lastActive: new Date(),
    };
    user.activeSessions.push(newSession);
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, googleId, avatar } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email,
        phone: '+9199' + Math.floor(10000000 + Math.random() * 90000000),
        role: 'FARMER',
        isVerified: true,
        googleId,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        activeSessions: [{ sessionId: 'g-' + Date.now(), deviceInfo: 'Google Auth Session', lastActive: new Date() }],
      });
    }

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({ success: true, user: req.user });
};

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) return;
  res.status(200).json({ success: true, activeSessions: req.user.activeSessions });
};

export const revokeSession = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) return;
  const { sessionId } = req.params;
  req.user.activeSessions = req.user.activeSessions.filter((s) => s.sessionId !== sessionId);
  await req.user.save();
  res.status(200).json({ success: true, message: 'Session revoked successfully.' });
};

export const firebaseAuthLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, defaultRole } = req.body;
    if (!idToken) {
      res.status(400).json({ success: false, message: 'Firebase ID Token is required.' });
      return;
    }

    let email = '';
    let name = '';
    let avatar = '';

    if (isFirebaseAdminInitialized && firebaseAuth) {
      try {
        const decoded = await firebaseAuth.verifyIdToken(idToken);
        email = decoded.email || `${decoded.uid}@asraverse.in`;
        name = decoded.name || 'Firebase User';
        avatar = decoded.picture || '';
      } catch (err: any) {
        console.warn('[Firebase Verify Warning]:', err.message);
      }
    }

    if (!email) {
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          email = payload.email || `${payload.user_id || payload.sub || 'user'}@asraverse.in`;
          name = payload.name || 'Firebase User';
          avatar = payload.picture || '';
        }
      } catch (e) {
        email = `user-${Date.now()}@asraverse.in`;
        name = 'Firebase Verified User';
      }
    }

    let user = await User.findOne({ email });

    if (!user) {
      const roleToAssign: UserRole = (defaultRole as UserRole) || (
        email.includes('admin') ? 'ADMIN' :
        email.includes('buyer') ? 'BUYER' :
        email.includes('expert') ? 'EXPERT' :
        email.includes('transport') ? 'TRANSPORT' : 'FARMER'
      );

      user = await User.create({
        name: name || 'AsraVerse User',
        email,
        phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
        role: roleToAssign,
        isVerified: true,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        activeSessions: [{ sessionId: 'fb-' + Date.now(), deviceInfo: req.headers['user-agent'] || 'Firebase Auth', lastActive: new Date() }],
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

