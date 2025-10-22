import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';

const router = Router();
const profileController = new ProfileController();

router.get('/', profileController.getProfile.bind(profileController));
router.put('/', profileController.updateProfile.bind(profileController));

export default router;
