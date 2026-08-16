import { Router } from 'express';
import { getWeatherForecast } from '../controllers/weatherController.js';
const router = Router();
router.get('/', getWeatherForecast);
export default router;
