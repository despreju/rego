import { Router } from 'express';
import { register, login, logout, check, getAllUsers, updateUser, getAllUsersAdmin, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/getUsers', protect, getAllUsers);
router.get('/getUsersAdmin', protect, getAllUsersAdmin);
router.get('/logout', logout);
router.get('/verify-token', protect, check);
router.put('/update', protect, updateUser);
router.put('/update-password', protect, updatePassword);
export default router;

