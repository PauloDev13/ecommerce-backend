import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth.controller";
import { userSignupValidator } from "../validator";

const router = Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

export default router;
