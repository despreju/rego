import { Router } from 'express';
import { register, login, logout, check, getAllUsers, updateUser } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/getUsers', protect, getAllUsers);
router.get('/logout', logout);
router.get('/verify-token', protect, check);
router.put('/update', protect, updateUser);
export default router;

