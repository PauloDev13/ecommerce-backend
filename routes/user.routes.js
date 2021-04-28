import { Router } from 'express';
import { userById, read, update } from '../controllers/user.controller';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
// import { userSignupValidator } from "../validator";

const router = Router();

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get('/user/:userId', requireSignin, isAuth, read);
router.put('/user/:userId', requireSignin, isAuth, update);

router.param('userId', userById);

export default router;
