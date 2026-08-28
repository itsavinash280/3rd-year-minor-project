import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { getInMemoryUser } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../config/firebaseAdmin.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
        return;
    }
    // Reject any synthetic/demo bypass tokens
    if (token.startsWith('demo-') || token.startsWith('token-')) {
        res.status(401).json({ success: false, message: 'Unauthorized. Demo and bypass tokens are not permitted.' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'asraverse_super_secret_jwt_key_2026_safe';
        let decodedUser = null;
        // 1. Attempt Backend Session JWT verification
        try {
            decodedUser = jwt.verify(token, secret);
        }
        catch (jwtErr) {
            // 2. If not a backend JWT, attempt Firebase ID Token verification
            const fbVerified = await verifyFirebaseToken(token);
            if (fbVerified) {
                decodedUser = {
                    firebaseUid: fbVerified.uid,
                    email: fbVerified.email,
                    name: fbVerified.name,
                };
            }
        }
        if (!decodedUser) {
            res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
            return;
        }
        const userId = decodedUser.id || decodedUser._id || decodedUser.sub;
        const firebaseUid = decodedUser.firebaseUid;
        const userEmail = decodedUser.email?.toLowerCase().trim();
        let dbUser = null;
        // Lookup user in MongoDB
        if (isMongoConnected()) {
            try {
                const query = [];
                if (userId)
                    query.push({ _id: userId });
                if (firebaseUid)
                    query.push({ firebaseUid });
                if (userEmail)
                    query.push({ email: userEmail });
                if (query.length > 0) {
                    dbUser = await User.findOne({ $or: query }).select('-password');
                }
            }
            catch (dbErr) {
                console.warn('[MongoDB Auth Lookup Notice]:', dbErr);
            }
        }
        // Lookup user in in-memory registry
        if (!dbUser) {
            if (firebaseUid)
                dbUser = getInMemoryUser(firebaseUid);
            if (!dbUser && userEmail)
                dbUser = getInMemoryUser(userEmail);
            if (!dbUser && userId)
                dbUser = getInMemoryUser(userId);
        }
        if (!dbUser) {
            res.status(401).json({
                success: false,
                message: 'Authenticated identity has no associated user profile in database. Please complete registration.',
            });
            return;
        }
        // Attach verified user with DB role
        req.user = dbUser;
        next();
    }
    catch (error) {
        console.error('[Auth Middleware Error]:', error);
        res.status(401).json({ success: false, message: 'Authentication failed. Please log in again.' });
        return;
    }
};
