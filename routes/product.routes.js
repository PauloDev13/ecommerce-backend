import { Router } from 'express';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import {
  create,
  productById,
  read,
  readAll,
  readRelated,
  remove,
  update,
} from '../controllers/product.controller';

const router = Router();

router.get('/products', readAll);
router.get('/products/related/:productId', readRelated);
router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.delete(
  '/product/:productId/:userId',
  requireSignin,
  isAuth,
  isAdmin,
  remove
);

router.param('userId', userById);
router.param('productId', productById);

export default router;
