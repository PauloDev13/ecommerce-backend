import { Router } from 'express';

import { isAdmin, isAuth, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import {
  create,
  read,
  readAll,
  categoryById,
  update,
  remove,
} from '../controllers/category.controller';
import { categoryValidator } from '../validator';

const router = Router();

router.get('/categories', readAll);
router.get('/category/:categoryId', read);
router.post(
  '/category/create/:userId',
  categoryValidator,
  requireSignin,
  isAuth,
  isAdmin,
  create
);

router.put(
  '/category/:categoryId/:userId',
  categoryValidator,
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.delete(
  '/category/:categoryId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.param('userId', userById);
router.param('categoryId', categoryById);

export default router;
