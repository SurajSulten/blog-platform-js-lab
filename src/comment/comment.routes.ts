import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { CommentController } from "./comment.controller";
import { isCommentAuthOrAdmin } from "../middleware/isCommentAuthOrAdmin";
import { isCommentAuth } from "../middleware/isCommentAuth";

const router = Router();

router.post('/blogs/:id/comments', isAuthenticated, CommentController.addComment)
router.get('/blogs/:id/comments', CommentController.getComments)
router.put('/blogs/:id/comments/:commentId', isAuthenticated, isCommentAuth, CommentController.editComment)
router.delete('/blogs/:id/comments/:commentId', isAuthenticated, isCommentAuthOrAdmin, CommentController.deleteComment)