import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware'; 
import { UserController } from './user.controller';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

// PUT: Update a user role (only admin can update)
router.put('users/:userId/role', isAuthenticated, isAdmin, UserController.updateUserRole);

export default router;