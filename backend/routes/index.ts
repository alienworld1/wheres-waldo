import { Router } from 'express';
import photoRouter from './photo';
const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Request a resource',
  });
});
router.use('/photo', photoRouter);

export default router;
