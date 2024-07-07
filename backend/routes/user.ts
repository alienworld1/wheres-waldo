import { Router } from 'express';
import * as userController from '../controllers/user';

const router = Router();

router.post('/user', userController.createUser);

router.get('/user/:userid', userController.getUser);
router.get('/user/:userid/time', userController.getUserTime);

router.post('/user/:userid', userController.saveToLeaderboard);

export default router;
