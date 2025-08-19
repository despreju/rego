import { Router } from 'express';
import { register, login, logout, check } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/verify-token', protect, check);

export default router;

