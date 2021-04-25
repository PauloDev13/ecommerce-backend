import { Router } from 'express';
import { digaOi } from '../controllers/user.controller';

const router = Router();

router.get('/', digaOi);

export default router;
