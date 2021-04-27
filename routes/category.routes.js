import { Router } from 'express';

import { isAdmin, isAuth, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import { create, read, categoryById } from '../controllers/category.controller';

const router = Router();

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  create
);

router.param('userId', userById);
router.param('categoryId', categoryById);

export default router;
