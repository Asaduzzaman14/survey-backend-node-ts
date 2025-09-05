import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { Controller } from './qus.controller';
const router = express();

router.post(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN),
  Controller.create,
);

router.post(
  '/answer',
  auth(ENUM_USER_ROLE.USER),
  Controller.createAnswer,
);


router.get(
  '/',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.getData,
);


router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.getDatabyId,
);

router.put(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.udpate,
);

export const QuestionRoutes = router;
