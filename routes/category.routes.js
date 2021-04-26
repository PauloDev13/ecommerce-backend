import { Router } from 'express';

import { isAdmin, isAuth, requireSignin } from '../controllers/auth.controller';
import { userById } from '../controllers/user.controller';
import { create } from '../controllers/category.controller';

const router = Router();

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('userId', userById);

export default router;
