import { Router } from 'express';
import {
  registerUser,
  loginUser,
  verifyOtp,
  getMe,
  getSessions,
  revokeSession,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);

router.get('/me', authenticateToken, getMe);
router.get('/sessions', authenticateToken, getSessions);
router.delete('/sessions/:sessionId', authenticateToken, revokeSession);

export default router;
