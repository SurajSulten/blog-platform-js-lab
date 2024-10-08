import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string;
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) {
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({message: "Invalid token"});
    }
}