import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/comment.entity';

export const isCommentAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const commentRepository = getRepository(Comment); 
        const user = req.user as User;
        const { commentId } = req.params;

        const comment = await commentRepository.findOne({
            where: {id: commentId}
        })

        if(!comment) {
            return res.status(404).json({message: "Comment not found"});
        }

        if(comment.user.id === user.id) {
            return next();
        }

        return res.status(403).json({message: 'You do not have permission to edit this comment'})
    } catch (error) {
        return res.status(500).json({message: 'An error occurred while checking permissions', error})
    }
};