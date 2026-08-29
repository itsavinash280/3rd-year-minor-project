import { Router } from 'express';
import {
  registerUser,
  loginUser,
  quickRoleLogin,
  verifyOtp,
  getMe,
  getSessions,
  revokeSession,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/quick-login', quickRoleLogin);
router.post('/verify-otp', verifyOtp);

// Legacy aliases so any old requests continue to work smoothly
router.post('/google', quickRoleLogin);
router.post('/register-role', quickRoleLogin);

router.get('/me', authenticateToken, getMe);
router.get('/sessions', authenticateToken, getSessions);
router.delete('/sessions/:sessionId', authenticateToken, revokeSession);

export default router;
