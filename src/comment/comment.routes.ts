import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { CommentController } from "./comment.controller";
import { isCommentAuthOrAdmin } from "../middleware/isCommentAuthOrAdmin";
import { isCommentAuth } from "../middleware/isCommentAuth";

export const commentRouter = Router();

commentRouter.post('/blogs/:id/comments', isAuthenticated, CommentController.addComment)
commentRouter.get('/blogs/:id/comments', CommentController.getComments)
commentRouter.put('/blogs/:id/comments/:commentId', isAuthenticated, isCommentAuth, CommentController.editComment)
commentRouter.delete('/blogs/:id/comments/:commentId', isAuthenticated, isCommentAuthOrAdmin, CommentController.deleteComment)