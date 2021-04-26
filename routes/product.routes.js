import { Router } from 'express';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import { create } from '../controllers/product.controller';

const router = Router();

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
// router.post("/signin", signin);
// router.get("/signout", signout);

router.param('userId', userById);

export default router;
