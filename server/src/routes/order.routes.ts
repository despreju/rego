import { Router } from 'express';
import { save, getAll } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/save', protect, save);
router.get('/orders', protect, getAll);

export default router;

