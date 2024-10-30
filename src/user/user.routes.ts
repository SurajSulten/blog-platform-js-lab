import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware'; 
import { UserController } from './user.controller';
import { isAdmin } from '../middleware/isAdmin';

const userRouter = Router();

userRouter.get('/profile', isAuthenticated, UserController.getUser)

userRouter.put('/profile', isAuthenticated, UserController.updateUser)

// PUT: Update a user role (only admin can update)
userRouter.put('/:userId/role', isAuthenticated, isAdmin, UserController.updateUserRole);

export default userRouter;