import { Router } from 'express';
import { save, getAll, remove, update } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/save', protect, save);
router.post('/orders', protect, getAll);
router.delete('/remove/:id', protect, remove);
router.put('/update', protect, update);
export default router;

