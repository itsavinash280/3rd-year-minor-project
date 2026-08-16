import { Router } from 'express';
import { recommendCrops, getCropRecommendationHistory, detectDisease, getDiseaseHistory, predictCropPrice, processVoiceQuery, } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = Router();
// Recommendation & Disease & Voice
router.post('/crop-recommendation', recommendCrops);
router.post('/disease-detection', detectDisease);
router.post('/price-prediction', predictCropPrice);
router.post('/voice/process', processVoiceQuery);
// History (Protected)
router.get('/crop-recommendation/history', authenticateToken, getCropRecommendationHistory);
router.get('/disease-detection/history', authenticateToken, getDiseaseHistory);
export default router;
