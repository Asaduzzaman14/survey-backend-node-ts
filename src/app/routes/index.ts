import express from 'express';
import { AdminsRoutes } from '../modules/admins/admins.routes';
import { AnsRoutes } from '../modules/ans/ans.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { profileRoutes } from '../modules/profile/profile.routes';
import { QuestionRoutes } from '../modules/qus/qus.routes';
import { UsersRoutes } from '../modules/users/users.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
  {
    path: '/qus',
    route: QuestionRoutes,
  },
  {
    path: '/admin',
    route: AdminsRoutes,
  },
  {
    path: '/users',
    route: UsersRoutes,
  },
  {
    path: '/answers',
    route: AnsRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
