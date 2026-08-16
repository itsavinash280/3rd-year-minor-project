import { Router } from 'express';
import { getFarmProfile, createOrUpdateFarmProfile } from '../controllers/farmController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = Router();
router.use(authenticateToken);
router.get('/', getFarmProfile);
router.post('/', createOrUpdateFarmProfile);
router.put('/', createOrUpdateFarmProfile);
export default router;
