import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ success: false, message: 'User session invalid or expired.' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
        return;
    }
};
