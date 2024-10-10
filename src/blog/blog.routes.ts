import { Router } from 'express';
import { BlogController } from './blog.controller'; // Assuming you have a BlogController
import { isAuthenticated } from '../middleware/authMiddleware'; // Auth middleware
import { isAuthorOrAdmin } from '../middleware/isAuthorOrAdmin'; // Custom role-based middleware

const router = Router();

// POST: Create a blog post (author must be authenticated)
router.post('/', isAuthenticated, BlogController.createBlog);

// GET: Fetch blog posts with pagination
router.get('/', BlogController.getBlogs);

// PUT: Update a blog post (only author or admin can update)
router.put('/:id', isAuthenticated, isAuthorOrAdmin, BlogController.updateBlog);

// DELETE: Delete a blog post (only author or admin can delete)
router.delete('/:id', isAuthenticated, isAuthorOrAdmin, BlogController.deleteBlog);

export default router;
