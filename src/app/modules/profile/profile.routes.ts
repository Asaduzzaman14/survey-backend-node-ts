import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { processImage, upload } from '../../../helpers/uplode';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProfileController } from './profile.controller';
import { ProfileValidation } from './profile.validations';
const router = express();

router.get('/', auth(ENUM_USER_ROLE.USER), ProfileController.getProfile);

router.patch('/', auth(ENUM_USER_ROLE.USER), ProfileController.updateOneInDB);

router.patch(
  '/update',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  upload.single('image'),
  processImage,
  validateRequest(ProfileValidation.update),
  ProfileController.updateOneInDB,
);


router.get('/summery', auth(ENUM_USER_ROLE.USER), ProfileController.getSummery);

export const profileRoutes = router;
