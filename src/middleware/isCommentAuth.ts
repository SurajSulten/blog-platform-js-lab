import { Response, NextFunction } from 'express';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/comment.entity';
import AppDataSource from '../database';
import { PrivateRequest } from '../shared/types/private-request.type';

export const isCommentAuth = async (req: PrivateRequest, res: Response, next: NextFunction) => {
    try {
        const commentRepository = AppDataSource.getRepository(Comment); 
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