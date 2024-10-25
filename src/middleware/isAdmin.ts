import { NextFunction, Request, Response } from "express";
import { User } from "../user/entities/user.entity";
import { PrivateRequest } from "../shared/types/private-request.type";

export const isAdmin = async (req: PrivateRequest, res: Response, next: NextFunction) => {
    const user = req.user as User

    if (user.role === 'admin') {
        return next();
    }

    return res.status(403).json({ message: 'You do not have permission to perform this action' });
}