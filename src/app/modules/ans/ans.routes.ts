import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { Controller } from './ans.controller';
const router = express();


router.get(
  '/submition',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.getSubmitions,
);

router.get(
  '/my-submition',
  auth(ENUM_USER_ROLE.USER),
  Controller.getUserSubmitions,
);

router.delete(
  '/delete-my-submition/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  Controller.deleteData,
);


router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.getData,
);


router.post(
  '/pdf',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  Controller.pdf,
);


export const AnsRoutes = router;
