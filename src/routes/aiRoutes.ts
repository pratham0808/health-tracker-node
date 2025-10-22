import { Router } from 'express';
import { getAISuggestions } from '../controllers/aiController';

const router = Router();

// AI suggestions endpoint
router.post('/suggestions', getAISuggestions);

export default router;
