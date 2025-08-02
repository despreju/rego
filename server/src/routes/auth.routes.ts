import { Router } from 'express';
import { register, login, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.get('/api/users', (_req, res) => {
  console.log(new Date().toLocaleTimeString(), 'fetchUsers called');
  res.json([{ id: 1, login: 'carole' }, { id: 2, login: 'julien' }, { id: 3, login: 'aurélie' }]);
});

export default router;

