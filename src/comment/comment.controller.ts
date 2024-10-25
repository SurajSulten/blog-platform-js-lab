import { Request, Response } from "express";
import { Blog } from "../blog/blog.entity";
import { Comment } from "./comment.entity";
import { User } from "../user/entities/user.entity";
import AppDataSource from "../database";
import { PrivateRequest } from "../shared/types/private-request.type";

export class CommentController {
  static async addComment(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const { content } = req.body;
      const blogRepository = AppDataSource.getRepository(Blog);
      const commentRepository = AppDataSource.getRepository(Comment);

      const blog = await blogRepository.findOne({
        where: { id: req.params.id },
      });
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      const user = req.user as User;
      const comment = commentRepository.create({ content, blog, user });

      await commentRepository.save(comment);

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json({ message: "Error adding comment", error });
    }
  }

  static async getComments(req: Request, res: Response): Promise<Response> {
    try {
      const commentRepository = AppDataSource.getTreeRepository(Comment);
      const blogRepository = AppDataSource.getRepository(Blog);

      const blog = await blogRepository.findOne({
        where: { id: req.params.id },
      });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      const comments = await commentRepository.find({
        where: { blog: { id: blog.id } },
        relations: ["user"],
      });

      return res.json(comments);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching comments", error });
    }
  }

  static async editComment(req: PrivateRequest, res: Response): Promise<Response> {
    try {
      const commentRepository = AppDataSource.getRepository(Comment);
      const comment = await commentRepository.findOne({
        where: { id: req.params.commentId },
        relations: ["user"],
      });
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      comment.content = req.body.content;
      await commentRepository.save(comment);

      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json({ message: "Error editing comment", error });
    }
  }
  static async deleteComment(req: PrivateRequest, res: Response): Promise<Response> {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOne({
        where: {id: req.params.commentId},
        relations: ['user'] 
    });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const user = req.user as User;
    if (comment.user.id !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'You do not have permission to delete this comment' });
    }

    await commentRepository.remove(comment);
    return res.json({ message: 'Comment deleted successfully' });
}
}
