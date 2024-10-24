import { Request, Response, NextFunction } from 'express';
import { Blog } from '../blog/blog.entity';
import { User } from '../user/entities/user.entity';
import AppDataSource from '../database';
import { PrivateRequest } from '../shared/types/private-request.type';

export const isBlogAuthor = async (req: PrivateRequest, res: Response, next: NextFunction) => {
    const blogRepository = AppDataSource.getRepository(Blog);
    const blog = await blogRepository.findOne({ where: { id: req.params.id }, relations: ['author'] });
    
    if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
    }

    const user = req.user as User; 

    if (blog.author.id === user.id) {
        return next();
    }

    return res.status(403).json({ message: 'You do not have permission to perform this action' });
};