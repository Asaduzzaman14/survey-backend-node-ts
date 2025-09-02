import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { Controller } from './auth.controller';
const router = express();


router.post('/create', Controller.createAdmin);

router.post('/login', Controller.login);

router.post(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN),
  Controller.changePassword,
);

router.post('/forgot-password', Controller.forgetPassword);

router.post('/reset-password', Controller.resetPassword);



export const authRoutes = router;
