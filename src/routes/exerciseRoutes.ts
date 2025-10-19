import { Router } from 'express';
import { ExerciseController } from '../controllers/exerciseController';

const router = Router();
const exerciseController = new ExerciseController();

router.get('/', exerciseController.getAll);
router.post('/', exerciseController.create);
router.delete('/:id', exerciseController.delete);

export default router;

