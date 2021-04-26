import { Router } from 'express';
import { userById } from '../controllers/user.controller';
import { requireSignin } from '../controllers/auth.controller';
// import { userSignupValidator } from "../validator";

const router = Router();

router.get('/secret/:userId', requireSignin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.param('userId', userById);

export default router;
