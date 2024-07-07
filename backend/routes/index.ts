import { Router } from 'express';
import photoRouter from './photo';
import userRouter from './user';
const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Request a resource',
  });
});
router.use('/photo', photoRouter);
router.use('/user', userRouter);

export default router;
