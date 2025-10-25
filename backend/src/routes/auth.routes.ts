import { Router } from 'express';
import { signup, signin, getCurrentUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authenticateToken, getCurrentUser);

export default router;