import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { getInMemoryUser } from '../controllers/authController.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';
    let decodedUser: any = null;

    try {
      decodedUser = jwt.verify(token, secret) as any;
    } catch (jwtErr) {
      res.status(401).json({ success: false, message: 'Invalid or expired authentication token. Please log in again.' });
      return;
    }

    if (!decodedUser) {
      res.status(401).json({ success: false, message: 'Invalid authentication token.' });
      return;
    }

    const userId = decodedUser.id || decodedUser._id || decodedUser.sub;
    const userEmail = decodedUser.email?.toLowerCase().trim();

    let dbUser: any = null;

    // Lookup user in MongoDB
    if (isMongoConnected()) {
      try {
        const query: any[] = [];
        if (userId && !userId.startsWith('user-') && !userId.startsWith('seed-')) {
          query.push({ _id: userId });
        }
        if (userEmail) {
          query.push({ email: userEmail });
        }

        if (query.length > 0) {
          dbUser = await User.findOne({ $or: query }).select('-password');
        }
      } catch (dbErr) {
        console.warn('[MongoDB Auth Lookup Notice]:', dbErr);
      }
    }

    // Lookup user in in-memory registry if not found in MongoDB
    if (!dbUser) {
      if (userEmail) dbUser = getInMemoryUser(userEmail);
      if (!dbUser && userId) dbUser = getInMemoryUser(userId);
    }

    // If still not found, construct safe decoded session user
    if (!dbUser && decodedUser.role) {
      dbUser = {
        _id: userId || `user-${Date.now()}`,
        id: userId || `user-${Date.now()}`,
        name: decodedUser.name || 'AsraVerse User',
        email: userEmail || 'user@asraverse.in',
        role: decodedUser.role,
        isVerified: true,
      };
    }

    if (!dbUser) {
      res.status(401).json({
        success: false,
        message: 'Authenticated user profile not found. Please log in again.',
      });
      return;
    }

    // Attach verified user
    req.user = dbUser;
    next();
  } catch (error: any) {
    console.error('[Auth Middleware Error]:', error);
    res.status(401).json({ success: false, message: 'Authentication failed. Please log in again.' });
  }
};
