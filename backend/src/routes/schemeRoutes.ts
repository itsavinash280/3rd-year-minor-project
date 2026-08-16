import { Router } from 'express';
import { getSchemes } from '../controllers/schemeController.js';

const router = Router();
router.get('/', getSchemes);
export default router;
