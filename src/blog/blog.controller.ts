import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../user/entities/user.entity';

export class BlogController {
    static async getBlogs(req: Request, res: Response): Promise<Response> {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;

        const blogRepository = getRepository(Blog);
        const [blogs, total] = await blogRepository.findAndCount({
            take: pageSize,
            skip: (page - 1) * pageSize,
        });

        return res.json({
            data: blogs,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    }

    static async createBlog(req: Request, res: Response): Promise<Response> {
        try {
            const { title, content, tags } = req.body;

            const blogRepository = getRepository(Blog);
            const userRepository = getRepository(User);
            const user = await userRepository.findOne(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const blog = blogRepository.create({
                title,
                content,
                tags,
                author: user,
            });

            await blogRepository.save(blog);

            return res.status(201).json(blog);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating blog post', error });
        }
    }

    static async updateBlog(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { title, content, tags } = req.body;

        const blogRepository = getRepository(Blog);

        const blog = await blogRepository.findOne({ where: { id }, relations: ['author'] });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        await blogRepository.save(blog); // Save the updated blog

        return res.status(200).json(blog);
    }

    static async deleteBlog(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const blogRepository = getRepository(Blog);

        const blog = await blogRepository.findOne({ where: { id }, relations: ['author'] });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        await blogRepository.remove(blog); // Remove the blog

        return res.status(200).json({ message: 'Blog deleted successfully' });
    }
}
