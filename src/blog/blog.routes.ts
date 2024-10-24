import { Router } from 'express';
import { BlogController } from './blog.controller'; 
import { isAuthenticated } from '../middleware/authMiddleware'; 
import { isBlogAuthOrAdmin } from '../middleware/isBlogAuthOrAdmin'; 
import { isBlogAuthor } from '../middleware/isBlogAuthor';

const blogRouter = Router();

// POST: Create a blog post (author must be authenticated)
blogRouter.post('/', isAuthenticated, BlogController.createBlog);

// GET: Fetch blog posts with pagination
blogRouter.get('/', BlogController.getBlogs);

// PUT: Update a blog post (only author update)
blogRouter.put('/:id', isAuthenticated, isBlogAuthor, BlogController.updateBlog);

// DELETE: Delete a blog post (only author or admin can delete)
blogRouter.delete('/:id', isAuthenticated, isBlogAuthOrAdmin, BlogController.deleteBlog);

export default blogRouter;
