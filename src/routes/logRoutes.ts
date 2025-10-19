import { Router } from 'express';
import { LogController } from '../controllers/logController';

const router = Router();
const logController = new LogController();

router.get('/', logController.getAll);
router.post('/', logController.create);
router.put('/:id', logController.update);
router.delete('/:id', logController.delete);

export default router;

