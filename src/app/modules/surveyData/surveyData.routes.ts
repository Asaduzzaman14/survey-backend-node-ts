import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { ReviewController } from './surveyData.controller';
const router = express();


router.post('/', auth(ENUM_USER_ROLE.USER), ReviewController.createReview);
router.get('/', auth(ENUM_USER_ROLE.USER), ReviewController.getMyReviews);
router.patch('/:id', auth(ENUM_USER_ROLE.USER), ReviewController.updateReview);
router.delete('/:id', auth(ENUM_USER_ROLE.USER), ReviewController.deleteReview);

router.get('/find-all', auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN), ReviewController.getAllReviews);

export const reviewRoutes = router;
