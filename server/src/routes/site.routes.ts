import { Router } from 'express';
import { createSite, getSitesForUser } from '../controllers/site.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/getSites', protect, getSitesForUser);
router.post('/create', protect, createSite);
export default router;

