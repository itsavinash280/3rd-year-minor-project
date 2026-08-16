import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { UserRole } from '../models/User.js';

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized. User context missing.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to perform this action. Required: [${roles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
