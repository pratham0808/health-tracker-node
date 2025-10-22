import { Router } from 'express';
import { ExerciseGroupsController } from '../controllers/exerciseGroupsController';

const router = Router();
const controller = new ExerciseGroupsController();

router.get('/', controller.getAll.bind(controller));
router.get('/user', controller.getByUserId.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/upsert', controller.upsert.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;


