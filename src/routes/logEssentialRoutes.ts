import { Router } from 'express';
import { LogEssentialController } from '../controllers/logEssentialController';

const router = Router();
const logEssentialController = new LogEssentialController();

router.get('/', logEssentialController.getLogEssential.bind(logEssentialController));
router.get('/all', logEssentialController.getAllLogEssentials.bind(logEssentialController));
router.post('/', logEssentialController.createOrUpdateLogEssential.bind(logEssentialController));
router.put('/', logEssentialController.createOrUpdateLogEssential.bind(logEssentialController));
router.delete('/:id', logEssentialController.deleteLogEssential.bind(logEssentialController));

export default router;
