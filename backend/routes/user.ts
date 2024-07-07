import { Router } from 'express';
import * as userController from '../controllers/user';

const router = Router();

router.post('/', userController.createUser);

router.get('/:userid', userController.getUser);
router.get('/:userid/time', userController.getUserTime);

router.post('/:userid', userController.saveToLeaderboard);

export default router;
