import { Router } from 'express';
import { userById } from '../controllers/user.controller';
import { isAuth, isAdmin, requireSignin } from '../controllers/auth.controller';
// import { userSignupValidator } from "../validator";

const router = Router();

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.param('userId', userById);

export default router;
