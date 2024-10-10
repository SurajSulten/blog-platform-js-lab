import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Blog } from '../blog/blog.entity';
import { User } from '../user/entities/user.entity';

export const isAuthorOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const blogRepository = getRepository(Blog);
    const blog = await blogRepository.findOne({ where: { id: req.params.id }, relations: ['author'] });

    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    const user = req.user as User; // Assuming req.user is correctly populated from your authentication middleware

    if (blog.author.id === user.id || user.role === 'admin') {
        return next();
    }

    return res.status(403).json({ message: 'You do not have permission to perform this action' });
};
