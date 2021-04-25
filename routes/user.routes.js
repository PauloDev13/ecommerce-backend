import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Usanto router');
});

export default router;
