import { Router } from 'express';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import {
  create,
  productById,
  read,
  remove,
} from '../controllers/product.controller';

const router = Router();

router.get('/product/:productId', read);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
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
