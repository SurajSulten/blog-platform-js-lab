import { Request, Response } from 'express';
import { Blog } from './blog.entity';
import AppDataSource from '../database';
import { PrivateRequest } from '../shared/types/private-request.type';
import { In, Like } from 'typeorm';
import { BlogLikes } from './blogLikes.entity';

export class BlogController {
    static async getBlogs(req: Request, res: Response): Promise<Response> {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.pageSize) || 10;
        const title = req.query.title as String | undefined;
        const content = req.query.content as String | undefined;
        const tags = req.query.tag as String | undefined;

        const blogRepository = AppDataSource.getRepository(Blog);

        const whereConditions: any = {};
        if (title) whereConditions.title = Like(`%${title}%`);
        if (content) whereConditions.content = Like(`%${content}%`);

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
            if (tagArray.length > 0) {
                whereConditions.tags = In(tagArray);
            }
        }

        const [blogs, total] = await blogRepository.findAndCount({
            where: whereConditions,
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

    static async getBlogById(req: Request, res: Response) {
        const {id} = req.params

        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({where: {id}})

        if(!blog) {
            return res.status(404).json({message: "Blog not found"})
        }

        return res.json({
            data: blog
        });
    }

    static async createBlog(req: PrivateRequest, res: Response): Promise<Response> {
        try {
            const { title, content, tags } = req.body;

            const blogRepository = AppDataSource.getRepository(Blog);
            if(!req.user) {
                return res.status(401).json({message: "Unauthorized"})
            }

            const user = req.user;
            
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

    static async updateBlog(req: PrivateRequest, res: Response): Promise<Response> {
        const { id } = req.params;
        const { title, content, tags } = req.body;

        const blogRepository = AppDataSource.getRepository(Blog);

        const blog = await blogRepository.findOne({ where: { id }, relations: ['author'] });
        if (!blog) return res.status(404).json({ message: 'Blog does not exist' });

        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        await blogRepository.save(blog); 

        return res.status(200).json(blog);
    }

    static async deleteBlog(req: PrivateRequest, res: Response): Promise<Response> {
        const { id } = req.params;

        const blogRepository = AppDataSource.getRepository(Blog);

        const blog = await blogRepository.findOne({ where: { id }, relations: ['author'] });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        await blogRepository.remove(blog); 

        return res.status(200).json({ message: 'Blog deleted successfully' });
    }

    static async likeBlog(req: PrivateRequest, res: Response) {
        const blogId = req.params.id;
        const userId = req.user?.id;

        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOneBy({id: blogId})
        if (!blog) return res.status(400).json({ message: 'Blog does not exist'});

        const blogLikesRepository = AppDataSource.getRepository(BlogLikes)

        if(await blogLikesRepository.exists({where: {userId, blogId}}) ) {
            blog.likes -= 1
            blogLikesRepository.delete({userId, blogId})
        } else {
            await blogLikesRepository.insert({
                userId,
                blogId
            })
            blog.likes += 1
             
        }
        await blogRepository.save(blog);

        return res.status(200).json(blog);
    }
}