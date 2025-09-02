import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { Controller } from './users.controller';
const router = express();


router.get('/', auth(ENUM_USER_ROLE.ADMIN), Controller.getAllFromDB);

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), Controller.getUserById);

router.patch(
  '/:id',
  // validateRequest(DepositMethodValidation.createDepositMethodZodSchema),
  Controller.updateOneInDB,
);

export const UsersRoutes = router;
