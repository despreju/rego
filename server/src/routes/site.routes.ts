import { Router } from 'express';
import { createSite, getAllSites, getSite, getSitesForUser } from '../controllers/site.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/getSites', protect, getSitesForUser);
router.post('/getSite', protect, getSite);
router.get('/getSitesAdmin', protect, getAllSites);
router.post('/create', protect, createSite);
export default router;

