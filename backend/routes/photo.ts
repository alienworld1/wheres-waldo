import { Router } from 'express';
import * as photo from '../controllers/photo';

const router = Router();

router.get('/', photo.getPhotos);

router.get('/:photo_name', photo.getPhoto);
router.get('/:photo_name/main', photo.getPhotoMain);
router.get('/:photo_name/preview', photo.getPhotoPreview);
router.get('/:photo_name/leaderboard', photo.getLeaderboardUsers);
router.get('/:photo_name/targets/:target_name', photo.getPhotoTarget);

export default router;
