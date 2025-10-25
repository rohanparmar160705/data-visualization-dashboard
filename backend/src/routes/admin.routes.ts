import { Router } from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/admin.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

export default router;